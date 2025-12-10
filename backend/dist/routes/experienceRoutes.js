"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experienceController_1 = require("../controllers/experienceController");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
// Create experience with file uploads
router.post('/create', upload_1.default.fields([
    { name: 'photos', maxCount: 15 },
    { name: 'music', maxCount: 1 },
]), experienceController_1.createExperience);
// Get experience by unique ID
router.get('/:uniqueId', experienceController_1.getExperience);
exports.default = router;
