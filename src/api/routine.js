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