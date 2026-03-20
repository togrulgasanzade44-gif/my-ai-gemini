const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Разрешаем запросы только POST
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "AIzaSyBbqJg9nqRHSH8IKnNqn75j-GgfABI6mFk");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt, image } = req.body;
    let parts = [{ text: prompt }];

    if (image) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: image }
      });
    }

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};