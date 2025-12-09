export type SceneType = 
  | 'arrival' 
  | 'door' 
  | 'darkRoom' 
  | 'celebration' 
  | 'gallery' 
  | 'finale';

export interface ExperienceData {
  _id?: string;
  uniqueId: string;
  recipientName: string;
  senderName: string;
  photos: string[];
  customMessage: string;
  musicChoice: string;
  customMusicUrl?: string;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface SceneProps {
  data: ExperienceData;
  onNext: () => void;
  isActive: boolean;
}

export interface FormData {
  recipientName: string;
  senderName: string;
  customMessage: string;
}
