import { Queue } from 'bullmq';
import { logger } from '@/utils/logger';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

/**
 * Service for managing background job queues.
 * Used for non-Temporal transient tasks.
 */
export const queueService = {
    workflowQueue: new Queue('workflow-background-tasks', { connection }),
    notificationQueue: new Queue('notifications', { connection }),

    /**
     * Add a job to the queue
     */
    async addJob(queueName: 'workflow' | 'notification', jobName: string, data: any) {
        const queue = queueName === 'workflow' ? this.workflowQueue : this.notificationQueue;

        try {
            const job = await queue.add(jobName, data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                }
            });
            logger.info(`Job ${jobName} added to queue ${queueName} with ID ${job.id}`);
            return job;
        } catch (error: any) {
            logger.error(`Failed to add job ${jobName} to queue ${queueName}:`, error.message);
            throw error;
        }
    }
};
