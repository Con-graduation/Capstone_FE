import client from './client';

export const getRoutine = async () => {
  const response = await client.get('/api/routines');
  return response;
};

export const postRoutine = async (routine) => {
  const response = await client.post('/api/routines', {
    title: routine.title,
    routineType: routine.routineType,
    sequence: routine.sequence,
    repeats: routine.repeats,
    bpm: routine.bpm,
  });
  return response.data;
};

export const getMainInformation = async () => {
  const response = await client.get(`/api/profile/main`);
  return response;
};

export const getMystats = async () => {
  const response = await client.get(`/api/profile/mystats`);
  return response;
};