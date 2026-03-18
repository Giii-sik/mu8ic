import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

function extractReplicateUrl(output: unknown): string {
  if (Array.isArray(output) && output.length > 0) {
    const first = output[0] as unknown as { url?: () => URL };
    return typeof first.url === 'function' ? first.url().toString() : String(first);
  }
  throw new Error(`Unexpected output format: ${JSON.stringify(output)}`);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const body = await req.json();
    const { prompt, userId } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Parse and validate options
    const lyricsRaw: string = typeof body.lyrics === 'string' ? body.lyrics : '';
    const lyrics = lyricsRaw.trim() === '' ? '[inst]' : lyricsRaw.trim();

    const durationRaw = Number(body.duration);
    const duration = [60, 120, 180].includes(durationRaw) ? durationRaw : 60;

    const batchSizeRaw = Number(body.batchSize);
    const batchSize = Math.min(4, Math.max(1, Number.isFinite(batchSizeRaw) ? Math.floor(batchSizeRaw) : 1));

    // Authenticated Supabase client (RLS applies with user's JWT)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const replicateInput = { lyrics, caption: prompt.trim(), duration };

    async function runWithRetry(input: typeof replicateInput, attempt = 0): Promise<unknown> {
      try {
        return await replicate.run(
          'visoar/ace-step-1.5:fd851baef553cb1656f4a05e8f2f8641672f10bc808718f5718b4b4bb2b07794',
          { input }
        );
      } catch (err: unknown) {
        const apiErr = err as { response?: { status?: number; headers?: { get?: (k: string) => string | null } } };
        if (apiErr?.response?.status === 429 && attempt < 3) {
          const retryAfter = parseInt(apiErr.response?.headers?.get?.('retry-after') ?? '10') || 10;
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          return runWithRetry(input, attempt + 1);
        }
        throw err;
      }
    }

    // Run sequentially to respect Replicate's burst limit (1 req burst at low credit)
    const outputs: unknown[] = [];
    for (let i = 0; i < batchSize; i++) {
      if (i > 0) await new Promise((r) => setTimeout(r, 1500));
      outputs.push(await runWithRetry(replicateInput));
    }

    // For each output: download audio, upload to storage, insert DB record
    const musics = await Promise.all(
      outputs.map(async (output) => {
        const replicateUrl = extractReplicateUrl(output);

        const audioRes = await fetch(replicateUrl);
        if (!audioRes.ok) throw new Error('Failed to download audio from Replicate');
        const audioBuffer = await audioRes.arrayBuffer();

        const fileName = `${crypto.randomUUID()}.mp3`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('musics')
          .upload(filePath, audioBuffer, { contentType: 'audio/mpeg' });

        if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

        const { data: music, error: insertError } = await supabase
          .from('musics')
          .insert({ user_id: userId, prompt: prompt.trim(), file_path: filePath, duration })
          .select()
          .single();

        if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

        return music;
      })
    );

    return NextResponse.json({ musics });
  } catch (err) {
    console.error('Music generation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate music' },
      { status: 500 }
    );
  }
}
