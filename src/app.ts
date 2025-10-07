import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from '@/database/db';
import authRoutes from '@/routes/auth.routes';

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.url, res.statusCode);
    next();
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

app.use("/api/auth", authRoutes);

export default app;