import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import personalityRoutes from './routes/personality.routes.js';
import adminRoutes from './routes/admin.routes.js';
import creatorRoutes from './routes/creator.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api', personalityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/creator', creatorRoutes);

app.use(errorHandler);

export default app;
