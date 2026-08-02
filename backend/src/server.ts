import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';
import basketRoutes from './routes/basket.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/basket', basketRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
