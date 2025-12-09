import { apiClient } from './index';
import {type  ApiResponse,type ExperienceData } from './types';

/**
 * Create a new birthday experience
 */
export const createExperience = async (formData: FormData): Promise<ApiResponse> => {
  try {
    console.log('📤 Creating experience...');
    
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, value.name, value.type, `(${(value.size / 1024).toFixed(2)}KB)`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    const { data } = await apiClient.post('/experience/create', formData);
    console.log('✅ Experience created:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Create experience failed:', error);
    
    // Parse error response
    if (error.response?.data) {
      if (typeof error.response.data === 'object') {
        throw error.response.data;
      }
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
        const match = error.response.data.match(/<pre>(.*?)<\/pre>/s);
        if (match) {
          const errorText = match[1].replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ');
          throw { success: false, message: errorText.split('\n')[0] };
        }
      }
      throw { success: false, message: error.response.data };
    }
    
    throw { success: false, message: error.message || 'Failed to create experience' };
  }
};

/**
 * Get experience by unique ID
 */
export const getExperience = async (uniqueId: string): Promise<{ success: boolean; data: ExperienceData }> => {
  try {
    console.log('📥 Fetching experience:', uniqueId);
    const { data } = await apiClient.get(`/experience/${uniqueId}`);
    console.log('✅ Experience fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Get experience failed:', error);
    throw error.response?.data || { success: false, message: 'Failed to get experience' };
  }
};
