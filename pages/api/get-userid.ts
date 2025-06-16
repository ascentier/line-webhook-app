export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const events = req.body.events || [];
    const userId = events[0]?.source?.userId;

    console.log("✅ ユーザーID取得:", userId);

    const replyToken = events[0]?.replyToken;
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (replyToken && token) {
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyToken,
          messages: [{ type: 'text', text: `あなたのuserIdは：${userId}` }],
        }),
      });
    }

    res.status(200).json({ userId });
  } catch (error) {
    console.error("❌ エラー発生:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
