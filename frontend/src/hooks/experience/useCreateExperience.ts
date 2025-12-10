import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExperience } from '../../api/experience.api';

interface FormData {
  recipientName: string;
  senderName: string;
  customMessage: string;
}

// Helper function to compress images
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Max dimensions
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(1)}KB -> ${(compressedFile.size / 1024).toFixed(1)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          0.85 // 85% quality
        );
      };
    };
  });
};

export const useCreateExperience = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
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
    setUploadProgress(0);
    
    try {
      console.log('Starting compression...');
      
      // Compress all images before upload
      const compressedPhotos = await Promise.all(
        photos.map(async (photo, index) => {
          setUploadProgress(((index + 1) / photos.length) * 30); // 0-30% for compression
          
          // Only compress if larger than 500KB
          if (photo.size > 500 * 1024) {
            return await compressImage(photo);
          }
          return photo;
        })
      );
      
      console.log('Compression complete. Starting upload...');
      setUploadProgress(40);
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('recipientName', formData.recipientName);
      formDataToSend.append('senderName', formData.senderName);
      formDataToSend.append('customMessage', formData.customMessage);
      formDataToSend.append('musicChoice', musicChoice);
      
      compressedPhotos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });
      
      if (customMusicFile) {
        console.log('Uploading custom music:', customMusicFile.name, customMusicFile.type, customMusicFile.size);
        formDataToSend.append('music', customMusicFile);
      }
      
      setUploadProgress(50);
      
      const response = await createExperience(formDataToSend);
      
      setUploadProgress(100);
      setIsLoading(false);
      
      if (response.success) {
        navigate(`/share/${response.data?.uniqueId}`);
      } else {
        alert('Failed to create experience: ' + response.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      setUploadProgress(0);
      console.error('Error creating experience:', error);
      alert(error.message || 'Failed to create experience. Please try again.');
    }
  };

  return {
    step,
    setStep,
    isLoading,
    uploadProgress,
    formData,
    updateFormData,
    canProceed,
    handleSubmit,
  };
};
