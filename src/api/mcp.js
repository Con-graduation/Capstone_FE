import client from "./client";

export async function postPrompt(prompt) {
    const response = await client.post("/api/mcp-ai/prompt", {
        prompt: prompt,
    });
    return response;
}