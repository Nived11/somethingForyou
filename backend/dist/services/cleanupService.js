"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCleanupService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Experience_1 = __importDefault(require("../models/Experience"));
const cloudinary_1 = require("cloudinary");
const startCleanupService = () => {
    node_cron_1.default.schedule('0 * * * *', async () => {
        try {
            console.log('🧹 Running cleanup service...');
            const expiredExperiences = await Experience_1.default.find({
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
                            await cloudinary_1.v2.uploader.destroy(`somethingforyou/photos/${publicId}`);
                        }
                    }
                    catch (error) {
                        console.error('Error deleting photo:', error);
                    }
                }
                // Delete custom music if exists
                if (experience.customMusicUrl) {
                    try {
                        const publicId = experience.customMusicUrl.split('/').pop()?.split('.')[0];
                        if (publicId) {
                            await cloudinary_1.v2.uploader.destroy(`somethingforyou/music/${publicId}`, {
                                resource_type: 'video' // Cloudinary uses 'video' for audio files
                            });
                        }
                    }
                    catch (error) {
                        console.error('Error deleting custom music:', error);
                    }
                }
            }
            const result = await Experience_1.default.deleteMany({
                expiresAt: { $lte: new Date() }
            });
            console.log(`🗑️  Deleted ${result.deletedCount} expired experiences`);
        }
        catch (error) {
            console.error('❌ Cleanup service error:', error);
        }
    });
    console.log('✅ Cleanup service started (runs hourly)');
};
exports.startCleanupService = startCleanupService;
