import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { FirebaseService } from './services/firebase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://healthtick-calendar-6klhk6ayj-krishna7054s-projects.vercel.app',
    'https://healthtick-calendar-six.vercel.app/',
    'http://localhost:3000',
    /\.vercel\.app$/, // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize clients on startup
async function initializeApp() {
  try {
    await FirebaseService.initializeClients();
    console.log('Clients initialized successfully');
  } catch (error) {
    console.error('Error initializing clients:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeApp();
});

export default app;
