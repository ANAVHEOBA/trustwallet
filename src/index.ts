import mongoose from 'mongoose';
import { config } from './config/environment';
import app from './app';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Start Express server
    const server = app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received');
      server.close(async () => {
        await mongoose.connection.close();
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
