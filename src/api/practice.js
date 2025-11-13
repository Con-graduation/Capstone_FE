import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const postPracticeComplete = async (id, audioFile) => {
  const formData = new FormData();
  formData.append('audioFile', audioFile);
  
  const accessToken = localStorage.getItem('accessToken');

  console.log('URL:', `${SERVER_URL}/api/routines/complete?routineId=${id}`);
  
  const response = await axios.post(`${SERVER_URL}/api/routines/complete?routineId=${id}`, formData, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return response.data;
};