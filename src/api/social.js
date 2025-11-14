import client from "./client";

// 구글 상태 조회
export async function getGoogleStatus() {
    const response = await client.get(`/api/auth/google/status`);
    return response;
  }

export async function postGoogleInfo(accessToken, refreshToken, expiresIn) {
    const response = await client.post(`/api/auth/google/connect`, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
    });
    return response;
}

export async function getGoogleToken() {
    const response = await client.get(`/api/auth/google/token`);
    return response;
}