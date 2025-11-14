import client from "./client";

// 로그인
export async function postLogin(username, password) {
    const response = await client.post("/api/auth/login", {
      username: username,
      password: password,
    });
    return response;
  }

// 회원가입
export const postRegister = async (email, name, username, nickname, password) => {
  try {
    const response = await client.post("/api/auth/register", {
      email: email,
      name: name,
      username: username,
      nickname: nickname,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 에러:", error);
    throw error;
  }
};

// 닉네임 중복검증
export async function getUsernameCheck(username) {
  const response = await client.get(`/api/auth/check/username?username=${username}`);
  return response;
}


export async function postRequestEmail(email) {
  const response = await client.post("/api/auth/request-email-code", {
    email: email,
  });
  return response;
}

export async function postVerifyEmail(email, verificationCode) {
  const response = await client.post("/api/auth/verify-email", {
    email: email,
    code: verificationCode,
  });
  return response;
}

// 구글 소셜 로그인
export async function postGoogleLogin(credential) {
  const response = await client.post("/api/auth/google", {
    credential: credential,
  });
  return response;
}

