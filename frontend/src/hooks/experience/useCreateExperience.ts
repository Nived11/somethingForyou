import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExperience } from '../../api/experience.api';

interface FormData {
  recipientName: string;
  senderName: string;
  customMessage: string;
}

export const useCreateExperience = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    recipientName: '',
    senderName: '',
    customMessage: '',
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const canProceed = (
    currentStep: number, 
    photosLength: number, 
    musicChoice: string, 
    customMusicFile: File | null
  ) => {
    switch (currentStep) {
      case 1:
        return formData.recipientName && formData.senderName;
      case 2:
        return photosLength >= 3;
      case 3:
        return formData.customMessage.length > 0;
      case 4:
        return musicChoice !== 'custom' || customMusicFile !== null;
      default:
        return true;
    }
  };

  const handleSubmit = async (
    photos: File[],
    musicChoice: string,
    customMusicFile: File | null
  ) => {
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('recipientName', formData.recipientName);
      formDataToSend.append('senderName', formData.senderName);
      formDataToSend.append('customMessage', formData.customMessage);
      formDataToSend.append('musicChoice', musicChoice);
      
      photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });
      
      if (customMusicFile) {
        console.log('Uploading custom music:', customMusicFile.name, customMusicFile.type, customMusicFile.size);
        formDataToSend.append('music', customMusicFile);
      }
      
      const response = await createExperience(formDataToSend);
      
      setIsLoading(false);
      
      if (response.success) {
        navigate(`/share/${response.data?.uniqueId}`);
      } else {
        alert('Failed to create experience: ' + response.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error creating experience:', error);
      alert(error.message || 'Failed to create experience. Please try again.');
    }
  };

  return {
    step,
    setStep,
    isLoading,
    formData,
    updateFormData,
    canProceed,
    handleSubmit,
  };
};
