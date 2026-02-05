// Temporal worker
// Runs workflow and activity tasks

import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
    const worker = await Worker.create({
        workflowsPath: require.resolve('./workflows'),
        activities,
        taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'workflowos-tasks',
    });

    console.log('🚀 Temporal worker started');
    await worker.run();
}

run().catch((err) => {
    console.error('Worker error:', err);
    process.exit(1);
});
