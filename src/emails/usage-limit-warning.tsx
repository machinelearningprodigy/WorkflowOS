import * as React from 'react';

interface UsageLimitWarningEmailProps {
    name: string;
    plan: string;
    usagePercentage: number;
    currentUsage: number;
    limit: number;
    resourceType: string;
}

export const UsageLimitWarningEmail: React.FC<UsageLimitWarningEmailProps> = ({
    name,
    plan,
    usagePercentage,
    currentUsage,
    limit,
    resourceType
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
            backgroundColor: '#fffbeb',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid #fde68a'
        }}>
            <div style={{
                backgroundColor: '#f59e0b',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>📊</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#92400e', marginBottom: '12px' }}>
                Approaching Usage Limit
            </h1>

            <p style={{ fontSize: '15px', color: '#b45309', marginBottom: '32px', fontWeight: '500' }}>
                Hi {name}, you've used <strong>{usagePercentage}%</strong> of your {plan} plan's {resourceType} limit.
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Current Usage
                    </p>
                    <div style={{
                        width: '100%',
                        height: '12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            width: `${usagePercentage}%`,
                            height: '100%',
                            backgroundColor: usagePercentage >= 90 ? '#ef4444' : '#f59e0b',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {currentUsage.toLocaleString()} / {limit.toLocaleString()} {resourceType}
                    </p>
                </div>
            </div>

            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                To avoid service interruption, consider upgrading to a higher plan with more capacity.
            </p>

            <a href="https://workflowos.com/dashboard/billing" style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                fontSize: '14px'
            }}>
                Upgrade Plan
            </a>
        </div>
    </div>
);

export default UsageLimitWarningEmail;
