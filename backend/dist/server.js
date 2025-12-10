"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cleanupService_1 = require("./services/cleanupService");
const experienceRoutes_1 = __importDefault(require("./routes/experienceRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/experience', experienceRoutes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'SomethingForYou API Running 🎉' });
});
// Connect to DB and start server
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        // Start auto-cleanup service
        (0, cleanupService_1.startCleanupService)();
    });
});
