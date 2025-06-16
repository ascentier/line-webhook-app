import { NextRequest } from 'next/server';

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events || [];
    const userId = events[0]?.source?.userId;
    const replyToken = events[0]?.replyToken;
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    console.log('✅ ユーザーID取得:', userId);

    if (replyToken && token) {
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
    }

    return new Response(JSON.stringify({ userId }), { status: 200 });
  } catch (error) {
    console.error('❌ エラー発生:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

