// Temporal worker
// Processes workflow and activity tasks from the queue

import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './activities';
import { logger } from '@/utils/logger';

async function run() {
    try {
        const address = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
        const connection = await NativeConnection.connect({
            address,
        });

        const worker = await Worker.create({
            connection,
            namespace: process.env.TEMPORAL_NAMESPACE || 'default',
            workflowsPath: require.resolve('./workflows'),
            activities,
            taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'workflowos-tasks',
        });

        logger.info(`🚀 Temporal worker started on ${address}`);
        logger.info(`Queue: ${process.env.TEMPORAL_TASK_QUEUE || 'workflowos-tasks'}`);

        await worker.run();
    } catch (err) {
        logger.error('Worker startup failed:', err);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    logger.info('Shutting down Temporal worker...');
    process.exit(0);
});

run().catch((err) => {
    logger.error('Worker unhandled error:', err);
    process.exit(1);
});
