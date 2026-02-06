import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, LayoutTemplate, Link2, BarChart2 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <Link href="/dashboard/workflows/new">
                        <Plus className="h-6 w-6" />
                        New Workflow
                    </Link>
                </Button>
                <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <Link href="/dashboard/templates">
                        <LayoutTemplate className="h-6 w-6" />
                        Browse Templates
                    </Link>
                </Button>
                <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <Link href="/dashboard/integrations">
                        <Link2 className="h-6 w-6" />
                        Connect App
                    </Link>
                </Button>
                <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <Link href="/dashboard/analytics">
                        <BarChart2 className="h-6 w-6" />
                        View Analytics
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
