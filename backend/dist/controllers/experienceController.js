"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExperience = exports.createExperience = void 0;
const Experience_1 = __importDefault(require("../models/Experience"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const stream_1 = require("stream");
// Generate unique ID
const generateUniqueId = () => {
    return 'exp_' + Date.now() + '_' + Math.random().toString(36).substring(7);
};
// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({
            folder: `somethingforyou/${folder}`,
            resource_type: resourceType,
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
            }
            else {
                console.log('Cloudinary upload success:', result?.secure_url);
                resolve(result?.secure_url || '');
            }
        });
        const readableStream = new stream_1.Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(stream);
    });
};
// Create Experience
const createExperience = async (req, res) => {
    try {
        console.log('Create experience request received');
        console.log('Body:', req.body);
        console.log('Files:', req.files);
        const { recipientName, senderName, customMessage, musicChoice } = req.body;
        // Validate required fields
        if (!recipientName || !senderName || !customMessage) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: recipientName, senderName, or customMessage'
            });
        }
        const files = req.files;
        if (!files?.photos || files.photos.length < 3) {
            return res.status(400).json({
                success: false,
                message: `Please upload at least 3 photos. Currently uploaded: ${files?.photos?.length || 0}`
            });
        }
        console.log(`Uploading ${files.photos.length} photos to Cloudinary...`);
        // Upload photos to Cloudinary
        const photoUploadPromises = files.photos.map((photo, index) => {
            console.log(`Uploading photo ${index + 1}/${files.photos.length}`);
            return uploadToCloudinary(photo.buffer, 'photos', 'image');
        });
        const photoUrls = await Promise.all(photoUploadPromises);
        console.log('All photos uploaded successfully');
        // Upload custom music if provided
        let customMusicUrl = undefined;
        if (musicChoice === 'custom' && files?.music?.[0]) {
            console.log('Uploading custom music to Cloudinary...');
            try {
                // Use 'video' resource type for audio files in Cloudinary
                customMusicUrl = await uploadToCloudinary(files.music[0].buffer, 'music', 'video');
                console.log('Custom music uploaded successfully');
            }
            catch (error) {
                console.error('Error uploading music:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload custom music file',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        // Generate unique ID
        const uniqueId = generateUniqueId();
        // Create experience
        const experience = new Experience_1.default({
            uniqueId,
            recipientName,
            senderName,
            photos: photoUrls,
            customMessage,
            musicChoice,
            customMusicUrl,
        });
        await experience.save();
        console.log('Experience saved to database:', uniqueId);
        res.status(201).json({
            success: true,
            message: 'Experience created successfully',
            data: {
                uniqueId: experience.uniqueId,
                expiresAt: experience.expiresAt,
            },
        });
    }
    catch (error) {
        console.error('Create experience error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create experience',
            error: error.message || 'Unknown error occurred'
        });
    }
};
exports.createExperience = createExperience;
// Get Experience by Unique ID
const getExperience = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const experience = await Experience_1.default.findOne({ uniqueId });
        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found or expired'
            });
        }
        // Check if expired
        if (new Date() > experience.expiresAt) {
            return res.status(410).json({
                success: false,
                message: 'This experience has expired'
            });
        }
        res.status(200).json({
            success: true,
            data: experience,
        });
    }
    catch (error) {
        console.error('Get experience error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get experience',
            error: error.message
        });
    }
};
exports.getExperience = getExperience;
