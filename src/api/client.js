import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_BASE_URL;

const client = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    
  });

client.interceptors.request.use(
    (config) => {
      // const accessToken = localStorage.getItem("accessToken");
      const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW0yNzQ2IiwiaWF0IjoxNzYwMzc3MjAyLCJleHAiOjE3NjkwMTcyMDJ9.T4nDfGLu3lv9hxKyrOrI3HJQtfURA_R65USQzWbnCoM";

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("✅ 토큰 포함:", config.headers.Authorization);
      } else {
        console.log("❌ 액세스 토큰이 없음");
      }
      
      console.log("📤 요청 URL:", `${config.baseURL}${config.url}`);
      console.log("📤 요청 헤더:", config.headers);
      return config;
    },
    (error) => {
      console.error("❌ 요청 인터셉터 에러:", error);
      return Promise.reject(error);
    }
  );

// 응답 인터셉터 추가
client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.error("❌ 인증 실패 (401): 토큰이 만료되었거나 유효하지 않음");
        // 필요시 로그아웃 처리
        // localStorage.removeItem('accessToken');
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

export default client;