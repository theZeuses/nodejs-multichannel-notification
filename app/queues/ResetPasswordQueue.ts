import { connectQueue } from "@configs/bull";

const queueName = 'reset-password-queue';
export const resetPasswordQueue = connectQueue(queueName);