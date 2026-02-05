// Temporal worker - Workflow execution worker
// Processes workflows using Temporal.io

import { Worker } from '@temporalio/worker';
import * as activities from '@/temporal/activities';
import { createTemporalConnection } from '@/temporal/client';

async function run() {
    const connection = await createTemporalConnection();

    const worker = await Worker.create({
        connection,
        namespace: 'default',
        taskQueue: 'workflow-execution',
        workflowsPath: require.resolve('@/temporal/workflows'),
        activities,
    });

    console.log('Temporal worker started');
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
