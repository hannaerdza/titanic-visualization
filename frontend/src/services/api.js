import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const getPassengers = async (params = {}) => {
  try {
    const response = await api.get('/passengers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching passengers:', error);
    throw error;
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/passengers/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

export const uploadCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/passengers/import-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
};