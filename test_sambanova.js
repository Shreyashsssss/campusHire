import dotenv from 'dotenv';
dotenv.config();

const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY;
const SAMBANOVA_API_URL = "https://api.sambanova.ai/v1/chat/completions";

async function test() {
    console.log("Testing Sambanova API...");
    console.log("Key present:", !!SAMBANOVA_API_KEY);

    try {
        const response = await fetch(SAMBANOVA_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.1-70B-Instruct",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Hello, does this work?" }
                ],
                temperature: 0.7,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("API Error:", response.status, text);
        } else {
            const data = await response.json();
            console.log("Success:", data.choices[0].message.content);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

test();
