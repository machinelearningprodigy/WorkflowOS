import * as React from 'react';

interface PasswordResetEmailProps {
    name: string;
    resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ name, resetUrl }) => (
    <div style={{
        fontFamily: '"Inter", sans-serif',
        backgroundColor: '#ffffff',
        padding: '40px 20px',
        color: '#1e293b'
    }}>
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#f8fafc',
            borderRadius: '32px',
            padding: '48px',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: '#f59e0b',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px'
            }}>
                <span style={{ fontSize: '32px' }}>🔐</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '16px' }}>
                Reset Your Password
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#64748b', marginBottom: '32px' }}>
                Hi {name}, we received a request to reset your password. Click the button below to create a new password.
            </p>

            <a href={resetUrl} style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '24px'
            }}>
                Reset Password
            </a>

            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '32px' }}>
                This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>

            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    © 2026 WorkflowOS Technologies Inc.
                </p>
            </div>
        </div>
    </div>
);

export default PasswordResetEmail;
