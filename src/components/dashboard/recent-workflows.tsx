import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RecentWorkflowsProps {
    data?: any[] // Todo: dedicated type
}

export function RecentWorkflows({ data = [] }: RecentWorkflowsProps) {
    // Mock data if empty
    const workflows = data.length > 0 ? data : [
        { id: '1', name: 'New User Onboarding', status: 'completed', lastRun: new Date(Date.now() - 1000 * 60 * 5), duration: '2s' },
        { id: '2', name: 'Daily Slack Report', status: 'running', lastRun: new Date(Date.now() - 1000 * 60 * 2), duration: 'Running' },
        { id: '3', name: 'Stripe Refund Process', status: 'failed', lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2), duration: '5s' },
        { id: '4', name: 'Lead Enrichment', status: 'completed', lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24), duration: '1.2s' },
    ];

    const handleAction = (action: string, id: string) => {
        console.log(`Action ${action} on workflow ${id}`);
    };

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Workflow</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Execution Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((wf) => (
                            <TableRow key={wf.id}>
                                <TableCell className="font-medium">{wf.name}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={wf.status === 'completed' ? 'default' : wf.status === 'failed' ? 'destructive' : 'secondary'}
                                    >
                                        {wf.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatDistanceToNow(wf.lastRun, { addSuffix: true })}</TableCell>
                                <TableCell>{wf.duration}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleAction('run', wf.id)}>
                                                <Play className="mr-2 h-4 w-4" /> Run Now
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('details', wf.id)}>
                                                View Details
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
