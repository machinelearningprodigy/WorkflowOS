// Email Template - Welcome Email
// Sent upon signup
import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
    <div>
        <h1>Welcome, {name}!</h1>
        <p>Thanks for joining WorkflowOS. Let's get started automating.</p>
    </div>
);
