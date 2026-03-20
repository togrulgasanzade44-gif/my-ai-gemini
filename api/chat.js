const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Разрешаем CORS, чтобы не было ошибок доступа
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    // Твой ключ из скриншота, прописан напрямую для надежности
    const genAI = new GoogleGenerativeAI("AIzaSyBbqJg9nqRHSH8IKnNqn75j-GgfABI6mFk");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt, image } = req.body;
    let parts = [{ text: prompt || "Привет" }];

    if (image) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: image }
      });
    }

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Гребаная ошибка:", error);
    return res.status(500).json({ error: error.message });
  }
};