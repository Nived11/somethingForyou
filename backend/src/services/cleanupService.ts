import cron from 'node-cron';
import Experience from '../models/Experience';
import { v2 as cloudinary } from 'cloudinary';

export const startCleanupService = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🧹 Running cleanup service...');
      
      const expiredExperiences = await Experience.find({
        expiresAt: { $lte: new Date() }
      });

      if (expiredExperiences.length === 0) {
        console.log('✅ No expired experiences to clean');
        return;
      }

      for (const experience of expiredExperiences) {
        // Delete photos
        for (const photoUrl of experience.photos) {
          try {
            const publicId = photoUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`somethingforyou/photos/${publicId}`);
            }
          } catch (error) {
            console.error('Error deleting photo:', error);
          }
        }

        // Delete custom music if exists
        if (experience.customMusicUrl) {
          try {
            const publicId = experience.customMusicUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`somethingforyou/music/${publicId}`, {
                resource_type: 'video' // Cloudinary uses 'video' for audio files
              });
            }
          } catch (error) {
            console.error('Error deleting custom music:', error);
          }
        }
      }

      const result = await Experience.deleteMany({
        expiresAt: { $lte: new Date() }
      });

      console.log(`🗑️  Deleted ${result.deletedCount} expired experiences`);
    } catch (error) {
      console.error('❌ Cleanup service error:', error);
    }
  });

  console.log('✅ Cleanup service started (runs hourly)');
};
