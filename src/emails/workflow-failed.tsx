import * as React from 'react';

interface WorkflowFailedEmailProps {
    workflowName: string;
    error: string;
    executionId: string;
}

export const WorkflowFailedEmail: React.FC<WorkflowFailedEmailProps> = ({
    workflowName,
    error,
    executionId
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
            backgroundColor: '#fff1f2',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid #fecdd3'
        }}>
            <div style={{
                backgroundColor: '#e11d48',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>!</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#9f1239', marginBottom: '12px' }}>
                Workflow Execution Failed
            </h1>

            <p style={{ fontSize: '15px', color: '#be123c', marginBottom: '32px', fontWeight: '500' }}>
                Your workflow <strong style={{ textDecoration: 'underline' }}>{workflowName}</strong> encountered an error and could not complete.
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Error Log</p>
                <code style={{ fontSize: '14px', color: '#1e293b', wordBreak: 'break-all' }}>{error}</code>
            </div>

            <a href={`https://workflowos.com/dashboard/executions/${executionId}`} style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                fontSize: '14px'
            }}>
                View Detail & Debug
            </a>
        </div>
    </div>
);

export default WorkflowFailedEmail;
