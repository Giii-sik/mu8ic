import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID!;
const ULTRA_PRODUCT_ID = process.env.POLAR_ULTRA_PRODUCT_ID!;

function verifySignature(body: string, headers: Record<string, string>, secret: string): boolean {
  const msgId = headers['webhook-id'];
  const msgTimestamp = headers['webhook-timestamp'];
  const msgSignature = headers['webhook-signature'];

  if (!msgId || !msgTimestamp || !msgSignature) return false;

  const signedContent = `${msgId}.${msgTimestamp}.${body}`;
  const base64Secret = Buffer.from(secret, 'utf-8').toString('base64');
  const keyBytes = Buffer.from(base64Secret, 'base64');
  const computed = crypto.createHmac('sha256', keyBytes).update(signedContent).digest('base64');

  return msgSignature.split(' ').some((sig) => {
    const [, value] = sig.split(',');
    return value === computed;
  });
}

function getCredits(productId: string | null): number | null {
  if (productId === PRO_PRODUCT_ID) return 100;
  if (productId === ULTRA_PRODUCT_ID) return 1100;
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = Object.fromEntries(req.headers);

  const valid = verifySignature(body, headers, process.env.POLAR_WEBHOOK_SECRET!);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const payload = JSON.parse(body);

  if (payload.type !== 'order.paid') {
    return NextResponse.json({ received: true });
  }

  const order = payload.data;
  const productId: string | null = order.product_id;
  const creditsToAdd = getCredits(productId);

  if (!creditsToAdd) {
    return NextResponse.json({ received: true });
  }

  const email: string = order.customer?.email;
  const externalId: string | null = order.customer?.external_id;

  // 중복 처리 방지
  const { data: existing } = await supabaseAdmin
    .from('payments')
    .select('id')
    .eq('polar_checkout_id', order.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  // 유저 조회: externalId(Supabase user.id) 우선, 없으면 이메일
  const { data: user, error: userError } = externalId
    ? await supabaseAdmin.from('users').select('id, credits').eq('id', externalId).single()
    : await supabaseAdmin.from('users').select('id, credits').eq('email', email).single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // payments 기록
  const { error: paymentError } = await supabaseAdmin.from('payments').insert({
    user_id: user.id,
    amount: order.net_amount,
    credits: creditsToAdd,
    status: 'paid',
    polar_checkout_id: order.id,
  });

  if (paymentError) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // 크레딧 충전
  const { error: creditError } = await supabaseAdmin
    .from('users')
    .update({ credits: user.credits + creditsToAdd })
    .eq('id', user.id);

  if (creditError) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
