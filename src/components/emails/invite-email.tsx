// Email Template - Team Invitation
// Sent when inviting a member
interface InviteEmailProps {
    inviterName: string;
    inviteLink: string;
}

export const InviteEmail: React.FC<InviteEmailProps> = ({ inviterName, inviteLink }) => (
    <div>
        <h1>Join {inviterName} on WorkflowOS</h1>
        <a href={inviteLink}>Click here to accept the invitation</a>
    </div>
);
