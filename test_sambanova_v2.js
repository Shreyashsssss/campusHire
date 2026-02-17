
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY;
const SAMBANOVA_API_URL = "https://api.sambanova.ai/v1/chat/completions";

async function test() {
    let output = "";
    const log = (msg) => { console.log(msg); output += msg + "\n"; };

    log("Testing Sambanova API...");
    log("Key: " + (SAMBANOVA_API_KEY ? "Present" : "Missing"));

    try {
        const response = await fetch(SAMBANOVA_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.1-8B-Instruct",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Hello" }
                ],
                temperature: 0.7,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const text = await response.text();
            log(`API Error: ${response.status} ${response.statusText}`);
            log(`Response Body: ${text}`);
        } else {
            const data = await response.json();
            log("Success!");
            log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        log(`Fetch Error: ${error.message}`);
        if (error.cause) log(`Cause: ${error.cause}`);
    }

    fs.writeFileSync('test_result.txt', output);
}

test();
