// Email Template - Workflow Failed Alert
// Sent when a critical workflow fails
interface WorkflowFailureEmailProps {
    workflowName: string;
    error: string;
    runUrl: string;
}

export const WorkflowFailureEmail: React.FC<WorkflowFailureEmailProps> = ({ workflowName, error, runUrl }) => (
    <div>
        <h1>Workflow Failed: {workflowName}</h1>
        <p>Error: {error}</p>
        <a href={runUrl}>View Run Logs</a>
    </div>
);
