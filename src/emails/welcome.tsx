import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
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
                backgroundColor: '#4f46e5',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px'
            }}>
                <img src="https://workflowos.com/logo-white.png" alt="WorkflowOS" style={{ width: '32px' }} />
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>
                Welcome to WorkflowOS, {name}!
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#64748b', marginBottom: '32px' }}>
                We're thrilled to have you on board. WorkflowOS is designed to help you automate complex logic with ease. Ready to build your first workflow?
            </p>

            <a href="https://workflowos.com/dashboard" style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
            }}>
                Get Started Now
            </a>

            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    © 2026 WorkflowOS Technologies Inc. • 123 Automation Way, San Francisco, CA
                </p>
            </div>
        </div>
    </div>
);

export default WelcomeEmail;
