// Queue worker - BullMQ worker process
// Processes background jobs from Redis queue

import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { executeWorkflow } from '@/lib/services/workflow-execution.service';
import { sendEmail } from '@/lib/services/email.service';
import { sendSMS } from '@/lib/services/sms.service';

const connection = new Redis(process.env.UPSTASH_REDIS_REST_URL!);

// Workflow execution worker
const workflowWorker = new Worker(
    'workflow-execution',
    async (job: Job) => {
        const { workflowId, userId, input } = job.data;

        console.log(`Executing workflow ${workflowId}...`);

        try {
            const result = await executeWorkflow(workflowId, userId, input);
            return result;
        } catch (error) {
            console.error(`Workflow ${workflowId} failed:`, error);
            throw error;
        }
    },
    { connection }
);

// Email worker
const emailWorker = new Worker(
    'email',
    async (job: Job) => {
        const { to, template, data } = job.data;
        await sendEmail({ to, template, data });
    },
    { connection }
);

// SMS worker
const smsWorker = new Worker(
    'sms',
    async (job: Job) => {
        const { to, message } = job.data;
        await sendSMS(to, message);
    },
    { connection }
);

// Webhook worker
const webhookWorker = new Worker(
    'webhook',
    async (job: Job) => {
        const { url, payload, signature } = job.data;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
            },
            body: JSON.stringify(payload),
        });
    },
    { connection }
);

console.log('Queue workers started');

// Graceful shutdown
process.on('SIGTERM', async () => {
    await workflowWorker.close();
    await emailWorker.close();
    await smsWorker.close();
    await webhookWorker.close();
    process.exit(0);
});
