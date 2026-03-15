import { api } from './api';

interface IProcessData {
  signedUrl: string;
  jobId: string;
  mimeType: string;
  userId: string;
  originalName: string;
}

export const processDocs = async (data: IProcessData) => {
  return await api.post('/api/v1/process/processDocs', data);
};

export const getJobStatus = async (jobId: string) => {
  return await api.get(`/api/v1/process/getJobStatus/${jobId}`);
};

export const deletePpt = async (id: string) => {
  return await api.delete(`/api/v1/process/deletePpt/${id}`)
}
