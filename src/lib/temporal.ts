// // Temporal Client - Connection to Temporal server
// // Schedules workflows and queries status
// import { Client, Connection } from '@temporalio/client';

// export const createTemporalClient = async () => {
//     const connection = await Connection.connect({
//         address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
//     });

//     return new Client({
//         connection,
//         namespace: process.env.TEMPORAL_NAMESPACE || 'default',
//     });
// };
