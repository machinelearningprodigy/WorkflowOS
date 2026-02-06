import * as React from 'react';

interface SecurityAlertEmailProps {
    name: string;
    eventType: string;
    location: string;
    device: string;
    timestamp: string;
}

export const SecurityAlertEmail: React.FC<SecurityAlertEmailProps> = ({
    name,
    eventType,
    location,
    device,
    timestamp
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
            backgroundColor: '#fef2f2',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid #fecaca'
        }}>
            <div style={{
                backgroundColor: '#ef4444',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>⚠️</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#991b1b', marginBottom: '12px' }}>
                Security Alert
            </h1>

            <p style={{ fontSize: '15px', color: '#b91c1c', marginBottom: '32px', fontWeight: '500' }}>
                Hi {name}, we detected a security event on your account.
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Event Type
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {eventType}
                    </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Location
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {location}
                    </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Device
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {device}
                    </p>
                </div>

                <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Time
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {timestamp}
                    </p>
                </div>
            </div>

            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                If this was you, you can safely ignore this email. If you don't recognize this activity, please secure your account immediately.
            </p>

            <a href="https://workflowos.com/dashboard/settings/security" style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                fontSize: '14px'
            }}>
                Review Security Settings
            </a>
        </div>
    </div>
);

export default SecurityAlertEmail;
