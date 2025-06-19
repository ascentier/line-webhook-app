// app/api/get-userid/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 受信したbody:", JSON.stringify(body, null, 2));
    const event = body.events?.[0];
    const userId = event?.source?.userId;
    const replyToken = event?.replyToken;
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    console.log('✅ LINEトークン:', token);

    if (replyToken && token && userId) {
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyToken,
          messages: [{ type: 'text', text: `あなたのuserIdは: ${userId}` }],
        }),
      });

      return new Response('OK', { status: 200 });
    } else {
      return new Response('Missing data', { status: 400 });
    }
  } catch (err) {
    console.error('エラー(get-userid):', err);
    return new Response('Server Error', { status: 500 });
  }
}

export async function GET() {
  return new Response('OK', { status: 200 });
}
