// Email service using Resend
// Handles transactional emails and notifications

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@workflowos.com';

interface EmailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        const { to, subject, html, text, replyTo } = options;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            text,
            replyTo,
        });

        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
    email: string,
    name: string
): Promise<boolean> {
    return sendEmail({
        to: email,
        subject: 'Welcome to WorkflowOS! 🎉',
        html: `
      <h1>Welcome to WorkflowOS, ${name}!</h1>
      <p>We're excited to have you on board.</p>
      <p>Get started by creating your first workflow in just a few minutes.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a>
    `,
    });
}

/**
 * Send workflow execution notification
 */
export async function sendWorkflowNotification(
    email: string,
    workflowName: string,
    status: 'success' | 'failed',
    details?: string
): Promise<boolean> {
    const subject =
        status === 'success'
            ? `✅ Workflow "${workflowName}" completed successfully`
            : `❌ Workflow "${workflowName}" failed`;

    return sendEmail({
        to: email,
        subject,
        html: `
      <h2>${subject}</h2>
      ${details ? `<p>${details}</p>` : ''}
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/workflows">View Details</a>
    `,
    });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
    email: string,
    resetToken: string
): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    return sendEmail({
        to: email,
        subject: 'Reset your WorkflowOS password',
        html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionEmail(
    email: string,
    tier: string,
    amount: number
): Promise<boolean> {
    return sendEmail({
        to: email,
        subject: `Subscription confirmed: ${tier} plan`,
        html: `
      <h2>Subscription Confirmed</h2>
      <p>Thank you for subscribing to the ${tier} plan!</p>
      <p>Amount: $${amount}/month</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Manage Subscription</a>
    `,
    });
}

/**
 * Send security alert email
 */
export async function sendSecurityAlert(
    email: string,
    alertType: string,
    details: string
): Promise<boolean> {
    return sendEmail({
        to: email,
        subject: `🔒 Security Alert: ${alertType}`,
        html: `
      <h2>Security Alert</h2>
      <p><strong>${alertType}</strong></p>
      <p>${details}</p>
      <p>If this wasn't you, please secure your account immediately.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/security">Review Security Settings</a>
    `,
    });
}
