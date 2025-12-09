import { useState } from 'react';

export const usePhotoUpload = (maxPhotos: number = 15) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newUrls]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previewUrls[index]);
    
    setPhotos(newPhotos);
    setPreviewUrls(newUrls);
  };

  const clearPhotos = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPhotos([]);
    setPreviewUrls([]);
  };

  return {
    photos,
    previewUrls,
    handlePhotoUpload,
    removePhoto,
    clearPhotos,
  };
};
