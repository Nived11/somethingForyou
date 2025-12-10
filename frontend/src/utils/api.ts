import axios from 'axios';

const API_BASE_URL =  import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const createExperience = async (formData: FormData) => {
  try {
    console.log('Sending request to create experience...');
    
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }

    const response = await api.post('/experience/create', formData);
    console.log('Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Try to parse error response
    if (error.response?.data) {
      // If it's JSON
      if (typeof error.response.data === 'object') {
        throw error.response.data;
      }
      // If it's HTML error page
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
        const match = error.response.data.match(/<pre>(.*?)<\/pre>/s);
        if (match) {
          const errorText = match[1].replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ');
          throw { message: 'Server error: ' + errorText.split('\n')[0] };
        }
      }
      throw { message: error.response.data };
    }
    
    throw { message: error.message || 'Failed to create experience' };
  }
};

export const getExperience = async (uniqueId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/experience/${uniqueId}`);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error.response?.data || { message: 'Failed to get experience' };
  }
};

export default api;
