import { api } from './api';

interface exportApiResponse {
  data: {
    statusCode: number;
    data: {};
    message: string;
  };
}

interface statApiResponse {
  data: {
    statusCode: number;
    data: {
      presentationGenerated: number;
      slidesGenerated: number;
      docsUploaded: number;
      totalExports: number;
      aiGenerations: number;
      lastActivity: string | null;
      weeklyActivity: {
        day: string;
        count: number;
      }[];
    };
    message: string;
  };
}

interface presentationResponse {
  data: {
    statusCode: number;
    data: {
      presentations: {
        id: string;
        name: string;
        slides: number;
        outputUrl: string;
        date: string;
      }[];
    };
    message: string;
  };
}

interface activityResponse {
  data: {
    statusCode: number;
    data: {
      activities: {
        id: string;
        type: 'upload' | 'generate' | 'export';
        label: string;
        subject: string;
        context: string;
        time: string;
      }[];
    };
    message: string;
  };
}

interface userInfoResponse {
  data: {
    statusCode: number
    data: {
      _id: string
      fullName: string
      email: string
    }
    message: string
    success: boolean
  }
}

interface PresentationApi {
  statusCode: number;
  data: {
        _id: string;
        userId: string
        name: string;
        slides: number;
        outputUrl: string;
        createdAt: string
        updatedAt: string
    }[]
  message: string
}

export const trackExport = async (
  presentationName: string
): Promise<exportApiResponse> => {
  return api.post('/api/v1/stat/export', { presentationName });
};

export const getStats = async (): Promise<statApiResponse> => {
  return api.get('/api/v1/stat/getStats');
};

export const getRecentPresentation = async (): Promise<presentationResponse> => {
    return api.get('/api/v1/stat/getRecentPresentations');
};

export const getRecentActivity = async (): Promise<activityResponse> => {
  return api.get('/api/v1/stat/getRecentActivity');
};

export const getUserInfo = async (): Promise<userInfoResponse> => {
  return api.get('/api/v1/stat/getUserInfo')
}

export const getPresentation = async (): Promise<PresentationApi> => {
  const res = await api.get('/api/v1/stat/getPresentation')
  return res.data
}
