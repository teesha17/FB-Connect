import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = () => {
    if (!process.env.MONGO_CONNECTION_URL) {
        console.log('MONGO_CONNECTION_URL is not defined in environment variables.');
        return;
    }
    const connectWithRetry = () => {
        mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
            .then(() => {
                console.log('Database connection successful!');
            })
            .catch((error) => {
                console.log(`Database connection failed: ${error.message}`);
                console.log('Retrying connection in 5 seconds...');
                setTimeout(connectWithRetry, 5000);
            });
    };

    connectWithRetry();

    mongoose.connection.on('disconnected', () => {
        console.log('Database connection lost. Attempting to reconnect...');
        connectWithRetry();
    });

    mongoose.connection.on('error', (error) => {
        console.log(`Database connection error: ${error.message}`);
    });
};

export default dbConnect;
