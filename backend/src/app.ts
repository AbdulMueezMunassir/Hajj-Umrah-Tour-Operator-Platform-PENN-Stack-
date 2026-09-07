import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MHK Travels API is running' });
});

// Placeholder routes
app.get('/api/packages', (req, res) => {
  res.json({ message: 'Packages endpoint - coming soon' });
});

export default app;