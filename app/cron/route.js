// app/cron/route.js  (Next.js keepalive route)
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL 
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_URL.replace(/\/api\/v1\/?$/, '')}/keepalive` 
      : null;

    if (!backendUrl) {
      return NextResponse.json({ ok: true, message: 'Keepalive not configured for current environment' });
    }

    const response = await fetch(backendUrl, { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json({ ok: false, message: `Status ${response.status}` }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({
      ok: true,
      message: 'Keepalive ping sent successfully',
      backendResponse: data
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error?.message || 'Ping bypassed' },
      { status: 200 }
    );
  }
}
