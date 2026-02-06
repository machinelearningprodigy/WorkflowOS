import * as React from 'react';

interface WorkflowSuccessEmailProps {
    workflowName: string;
    executionId: string;
    duration: number;
    stepsCompleted: number;
}

export const WorkflowSuccessEmail: React.FC<WorkflowSuccessEmailProps> = ({
    workflowName,
    executionId,
    duration,
    stepsCompleted
}) => (
    <div style={{
        fontFamily: '"Inter", sans-serif',
        backgroundColor: '#ffffff',
        padding: '40px 20px',
        color: '#1e293b'
    }}>
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#f0fdf4',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid #bbf7d0'
        }}>
            <div style={{
                backgroundColor: '#10b981',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>✓</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#065f46', marginBottom: '12px' }}>
                Workflow Completed Successfully
            </h1>

            <p style={{ fontSize: '15px', color: '#047857', marginBottom: '32px', fontWeight: '500' }}>
                Your workflow <strong style={{ textDecoration: 'underline' }}>{workflowName}</strong> has finished executing.
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Execution Time
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`}
                    </p>
                </div>

                <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Steps Completed
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {stepsCompleted} steps
                    </p>
                </div>
            </div>

            <a href={`https://workflowos.com/dashboard/executions/${executionId}`} style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                fontSize: '14px'
            }}>
                View Execution Details
            </a>
        </div>
    </div>
);

export default WorkflowSuccessEmail;
