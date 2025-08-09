// app/api/keepalive/route.js  (Next.js 13+ app directory)
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ping your backend server
    const backendUrl = 'https://villa-camping-backend.onrender.com/keepalive';
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error(`Backend ping failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Keepalive successful:', data);

    return NextResponse.json({
      ok: true,
      message: 'Keepalive ping sent successfully',
      backendResponse: data
    });
  } catch (error) {
    console.error('Error in keepalive:', error);

    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
