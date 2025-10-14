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

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        console.log("❌ 액세스 토큰이 없음");
      }
      
      return config;
    },
    (error) => {
      console.error("❌ 요청 인터셉터 에러:", error);
      return Promise.reject(error);
    }
  );

export default client;