"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Store files in memory as buffer
const storage = multer_1.default.memoryStorage();
// File filter - Accept images and audio files
const fileFilter = (req, file, cb) => {
    console.log('File upload attempt:', {
        fieldname: file.fieldname,
        mimetype: file.mimetype,
        originalname: file.originalname
    });
    // Accept images
    if (file.fieldname === 'photos' && file.mimetype.startsWith('image/')) {
        cb(null, true);
        return;
    }
    // Accept audio files with multiple mime types
    if (file.fieldname === 'music') {
        const validAudioTypes = [
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/wave',
            'audio/x-wav',
            'audio/m4a',
            'audio/x-m4a',
            'audio/mp4',
            'audio/ogg',
            'audio/webm',
            'audio/aac',
            'audio/x-aac',
            'audio/flac',
            'audio/x-flac',
        ];
        // Check by mimetype
        if (file.mimetype.startsWith('audio/') || validAudioTypes.includes(file.mimetype)) {
            cb(null, true);
            return;
        }
        // Also check by file extension
        const ext = file.originalname.toLowerCase().split('.').pop();
        const validExtensions = ['mp3', 'mpeg', 'wav', 'wave', 'm4a', 'mp4', 'ogg', 'webm', 'aac', 'flac'];
        if (validExtensions.includes(ext || '')) {
            cb(null, true);
            return;
        }
    }
    console.error('Invalid file:', file.fieldname, file.mimetype);
    cb(new Error(`Invalid file type for ${file.fieldname}. Expected ${file.fieldname === 'photos' ? 'images' : 'audio files'}.`), false);
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
        files: 16, // 15 photos + 1 music
    },
});
exports.default = upload;
