const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const genAI = new GoogleGenerativeAI("AIzaSyBbqJg9nqRHSH8IKnNqn75j-GgfABI6mFk");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt, image } = JSON.parse(event.body);
    let parts = [{ text: prompt || "Привет" }];

    if (image) {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: image } });
    }

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ text: response.text() }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};