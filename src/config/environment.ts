import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  SESSION_SECRET: string;
  NODE_ENV: string;
}

export const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://wisdomvolt:xW2M6wyS0hfsHxLk@cluster0.xtrvweq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || '64fed9283c2c8c491932d6190dbece40781363ddb63a12d113641285ed6803ecd80faed37b76ce2dbc9eae97480b0f77447804218d46cbc4bc5d98f82bf68b21',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-key-here',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
const requiredEnvVars: (keyof Config)[] = ['MONGODB_URI', 'JWT_SECRET', 'SESSION_SECRET'];

requiredEnvVars.forEach((envVar) => {
  if (!config[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export default config;
