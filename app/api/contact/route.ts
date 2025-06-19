export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    const now = new Date();
    const formattedDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分`;

    const lineMessage = `
ホームプロガードお問い合わせ

👤お客様情報
【お名前】${name}
【電話番号】${phone}
【メールアドレス】${email}

💬お問い合わせ内容
${message}

🗓️受付日時
${formattedDate}
`.trim();

    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const userId = process.env.LINE_ADMIN_USER_ID;

    if (!token || !userId) {
      return new Response('LINE設定未定義', { status: 500 });
    }

    await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userId,
        messages: [{ type: 'text', text: lineMessage }],
      }),
    });

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('エラー:', err);
    return new Response('Server Error', { status: 500 });
  }
}

export async function GET() {
  return new Response('OK', { status: 200 });
}
