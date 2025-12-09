export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    uniqueId: string;
    expiresAt: Date;
  };
  error?: string;
}

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
