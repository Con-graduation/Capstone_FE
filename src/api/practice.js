import client from './client';

export const postPractice = async (formData) => {
  const response = await client.post('/api/practice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};