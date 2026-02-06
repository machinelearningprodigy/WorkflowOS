import * as React from 'react';

interface SubscriptionConfirmEmailProps {
    name: string;
    plan: string;
    amount: number;
    billingCycle: string;
    nextBillingDate: string;
    invoiceUrl?: string;
}

export const SubscriptionConfirmEmail: React.FC<SubscriptionConfirmEmailProps> = ({
    name,
    plan,
    amount,
    billingCycle,
    nextBillingDate,
    invoiceUrl
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
            backgroundColor: '#f0f9ff',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid #bae6fd'
        }}>
            <div style={{
                backgroundColor: '#0ea5e9',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>🎉</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#075985', marginBottom: '12px' }}>
                Subscription Confirmed!
            </h1>

            <p style={{ fontSize: '15px', color: '#0369a1', marginBottom: '32px', fontWeight: '500' }}>
                Thank you, {name}! Your subscription to the <strong>{plan}</strong> plan is now active.
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Plan
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {plan}
                    </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Amount
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        ${amount.toFixed(2)} / {billingCycle}
                    </p>
                </div>

                <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Next Billing Date
                    </p>
                    <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
                        {nextBillingDate}
                    </p>
                </div>
            </div>

            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                You now have access to all {plan} features. Start building powerful automations today!
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="https://workflowos.com/dashboard" style={{
                    backgroundColor: '#0ea5e9',
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontSize: '14px'
                }}>
                    Go to Dashboard
                </a>

                {invoiceUrl && (
                    <a href={invoiceUrl} style={{
                        backgroundColor: '#ffffff',
                        color: '#0ea5e9',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        fontSize: '14px',
                        border: '2px solid #0ea5e9'
                    }}>
                        View Invoice
                    </a>
                )}
            </div>
        </div>
    </div>
);

export default SubscriptionConfirmEmail;
