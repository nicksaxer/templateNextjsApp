import 'server-only';
import mongoose from 'mongoose';
import { requiredEnv } from './env.config';

let connectionPromise: Promise<typeof mongoose> | undefined;

export async function connectDatabase(): Promise<void> {
    if (mongoose.connection.readyState === 1) {return;}
    connectionPromise ??= mongoose.connect(requiredEnv('MONGODB_URI'), {serverSelectionTimeoutMS: 5000}).catch(error => {
        connectionPromise = undefined;
        throw error;
    });
    await connectionPromise;
}

export const db = mongoose.connection;
