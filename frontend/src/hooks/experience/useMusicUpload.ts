import { useState } from 'react';
import { defaultAudioTracks } from '../../config/audioConfig';

export const useMusicUpload = () => {
  const [musicChoice, setMusicChoice] = useState<string>(defaultAudioTracks[0]?.id || 'song1');
  const [customMusicFile, setCustomMusicFile] = useState<File | null>(null);
  const [customMusicPreview, setCustomMusicPreview] = useState<string>('');
  const [customMusicUrl, setCustomMusicUrl] = useState<string>('');

  const handleCustomMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    if (file.size > 10 * 1024 * 1024) {
      alert('Music file must be less than 10MB');
      return;
    }
    
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/x-m4a'];
    const isValidAudio = file.type.startsWith('audio/') || validTypes.includes(file.type) || 
                         file.name.endsWith('.mp3') || file.name.endsWith('.mpeg') || 
                         file.name.endsWith('.wav') || file.name.endsWith('.m4a');
    
    if (!isValidAudio) {
      alert('Please upload a valid audio file (MP3, MPEG, WAV, M4A)');
      console.log('Invalid file type:', file.type);
      return;
    }

    if (customMusicUrl) {
      URL.revokeObjectURL(customMusicUrl);
    }

    setMusicChoice('custom');
    setCustomMusicFile(file);
    setCustomMusicPreview(file.name);
    
    const url = URL.createObjectURL(file);
    setCustomMusicUrl(url);
    
    console.log('Music uploaded successfully:', url);
  };

  const removeCustomMusic = () => {
    if (customMusicUrl) {
      URL.revokeObjectURL(customMusicUrl);
    }
    setMusicChoice(defaultAudioTracks[0]?.id || 'song1');
    setCustomMusicFile(null);
    setCustomMusicPreview('');
    setCustomMusicUrl('');
  };

  const changeMusicChoice = (choice: string) => {
    if (choice === 'custom') {
      setMusicChoice('custom');
    } else {
      if (customMusicUrl && customMusicFile) {
        URL.revokeObjectURL(customMusicUrl);
      }
      setMusicChoice(choice);
    }
  };

  return {
    musicChoice,
    customMusicFile,
    customMusicPreview,
    customMusicUrl,
    handleCustomMusicUpload,
    removeCustomMusic,
    changeMusicChoice,
  };
};
