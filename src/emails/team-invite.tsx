import * as React from 'react';

interface TeamInviteEmailProps {
    inviterName: string;
    inviterEmail: string;
    role: string;
    inviteUrl: string;
    organizationName?: string;
}

export const TeamInviteEmail: React.FC<TeamInviteEmailProps> = ({
    inviterName,
    inviterEmail,
    role,
    inviteUrl,
    organizationName
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
            backgroundColor: '#f8fafc',
            borderRadius: '32px',
            padding: '48px',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: '#3b82f6',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px'
            }}>
                <span style={{ fontSize: '32px' }}>👥</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '16px' }}>
                You're Invited to Join {organizationName || 'a Team'}!
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#64748b', marginBottom: '24px' }}>
                <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join their team on WorkflowOS as a <strong>{role}</strong>.
            </p>

            <div style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '20px',
                marginBottom: '32px',
                textAlign: 'left'
            }}>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                    <strong>Your Role:</strong> {role.charAt(0).toUpperCase() + role.slice(1)}
                </p>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                    As a {role}, you'll be able to collaborate on workflows and help automate your team's processes.
                </p>
            </div>

            <a href={inviteUrl} style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
            }}>
                Accept Invitation
            </a>

            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '32px' }}>
                This invitation will expire in 7 days.
            </p>

            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    © 2026 WorkflowOS Technologies Inc.
                </p>
            </div>
        </div>
    </div>
);

export default TeamInviteEmail;
