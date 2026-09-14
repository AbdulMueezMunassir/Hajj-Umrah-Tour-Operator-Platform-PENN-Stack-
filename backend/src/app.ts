import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import packageRoutes from './routes/package.routes';
import bookingRoutes from './routes/booking.routes';  // ← ADD
import { errorHandler } from './middleware/errorHandler';
import { seedAdmin } from './utils/seedAdmin';
import paymentRoutes from './routes/payment.routes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MHK Travels API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);  // ← ADD
app.use('/api/payments', paymentRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Error handler
app.use(errorHandler);

// Seed admin on startup
seedAdmin();

export default app;