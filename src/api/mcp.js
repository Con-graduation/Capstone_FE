import client from "./client";

export async function postPrompt(prompt) {
    const response = await client.post("/api/mcp-ai/prompt", {
        prompt: prompt,
    });
    return response;
}

export async function postMusicRecommend(genre) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await client.post("/api/mcp-ai/recommend-song", {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          genre: genre
    });
    return response;
}