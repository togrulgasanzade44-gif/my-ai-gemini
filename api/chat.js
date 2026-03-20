import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Разрешаем запросы только методом POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Твой рабочий ключ Gemini
    const KEY = "AIzaSyDVV11NXaKNBcQ2SCgd-CJXqiWyOiOy53Q";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // Если Google вернул ошибку, прокидываем её
        if (data.error) {
            return res.status(data.error.code || 500).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Ошибка на сервере Vercel' });
    }
}