import Queue, { QueueOptions } from 'bull'; 
import * as dotenv from "dotenv";
dotenv.config();

export const connectQueue = (queueName: string, queueOptions?: QueueOptions) => new Queue(queueName, {
    redis: {
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        host: process.env.REDIS_HOST ?? 'localhost',
        password: process.env.REDIS_PASSWORD
    },
    prefix: "bull-",
    ...queueOptions
});