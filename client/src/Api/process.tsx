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
