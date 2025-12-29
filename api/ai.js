const Groq = require('groq-sdk');

// SDKの初期化
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 使用するモデルを指定
// Llama 3 70B などが高速で高性能です
const MODEL_NAME = 'llama3-70b-8192';

module.exports = async (req, res) => {
  // 1. POSTリクエストの確認
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed, use POST' });
  }

  // APIキーのチェック
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not set.' });
  }

  // 2. リクエストボディの取得
  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // 3. Groq APIの呼び出し
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL_NAME,
    });

    // 結果の抽出
    const aiResponseText = chatCompletion.choices[0]?.message?.content || "";

    // 4. クライアントへのレスポンス
    res.status(200).json({
      userPrompt: prompt,
      groqResponse: aiResponseText,
      backendMessage: `Successfully generated using ${MODEL_NAME}`
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({
      error: 'API Error',
      details: error.message
    });
  }
};
