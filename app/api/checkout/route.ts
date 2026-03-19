import { NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_API_TOKEN,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});

export async function POST(req: NextRequest) {
  try {
    const { productId, customerEmail, customerId, successUrl } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: customerEmail ?? undefined,
      externalCustomerId: customerId ?? undefined,
      successUrl: successUrl ?? undefined,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error('Checkout creation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
