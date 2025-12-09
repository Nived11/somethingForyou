import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  uniqueId: string;
  recipientName: string;
  senderName: string;
  photos: string[];
  customMessage: string;
  musicChoice: string;
  customMusicUrl?: string;  // Add this for custom uploaded music
  createdAt: Date;
  expiresAt: Date;
}

const ExperienceSchema = new Schema<IExperience>({
  uniqueId: { type: String, required: true, unique: true },
  recipientName: { type: String, required: true },
  senderName: { type: String, required: true },
  photos: [{ type: String }],
  customMessage: { type: String, required: true },
  musicChoice: { type: String, default: 'default' },
  customMusicUrl: { type: String },  // Add this
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});

ExperienceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
