import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { startCleanupService } from './services/cleanupService';
import experienceRoutes from './routes/experienceRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/experience', experienceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SomethingForYou API Running 🎉' });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Start auto-cleanup service
    startCleanupService();
  });
});
