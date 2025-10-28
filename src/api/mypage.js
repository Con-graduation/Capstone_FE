import client from "./client";
import axios from "axios";

export const getMypage = async () => {
    const response = await client.get("/api/mypage");
    return response.data;
};

export const getProfileDownloadUrl = async () => {
    const response = await client.get("/api/profile-image/download-url");
    // console.log('프로필 이미지 다운로드 URL:', response);
    return response.data;
};

export const postProfileUploadUrl = async (file) => {
    const requestBody = {
        contentType: file.type || "image/png",
        filename: file.name 
    };
    const response = await client.post("/api/profile-image/upload-url", requestBody);
    return response.data;
}

/* S3 업로드 헬퍼 */
export const uploadToS3 = async (url, file) => {
    return axios.put(url, file, {
      headers: { "Content-Type": file.type },
    });
  };

export const postConfirmProfile = async (objectKey) => {
    const requestBody = { objectKey };
    const response = await client.post("/api/profile-image/confirm", requestBody);
    return response.data;
};