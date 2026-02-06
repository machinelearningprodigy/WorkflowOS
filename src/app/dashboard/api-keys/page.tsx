'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Copy, Eye, Key, MoreHorizontal, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

const initialKeys = [
    { name: "Production API Key", key: "wf_live_••••••••••••••••", status: "Active", lastUsed: "2 mins ago", created: "Oct 12, 2025" },
    { name: "Development Key", key: "wf_test_••••••••••••••••", status: "Active", lastUsed: "1 day ago", created: "Dec 05, 2025" },
]

export default function ApiKeysPage() {
    const [keys, setKeys] = useState(initialKeys)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied!",
            description: "API key copied to clipboard.",
        })
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
                    <p className="text-muted-foreground">
                        Manage keys to access the WorkflowOS API.
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Plus className="mr-2 h-4 w-4" /> Create New Key
                </Button>
            </div>

            <Card className="bg-indigo-50 border-indigo-100">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Key className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-indigo-900">Security Best Practices</CardTitle>
                            <CardDescription className="text-indigo-700/80">
                                Never share your API keys or commit them to version control. If a key is compromised, revoke it immediately.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="space-y-4">
                {keys.map((key, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{key.name}</span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {key.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <code className="bg-muted px-2 py-1 rounded text-sm text-muted-foreground font-mono">
                                            {key.key}
                                        </code>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(key.key)}>
                                            <Copy className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="text-xs text-muted-foreground">Created on {key.created}</div>
                                    <div className="text-xs text-muted-foreground">Last used {key.lastUsed}</div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" className="h-8">
                                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Roll
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 text-destructive hover:text-destructive">
                                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Revoke
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usage Limits</CardTitle>
                    <CardDescription>Daily API request limits</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Requests per hour</span>
                            <span className="font-medium">1,240 / 5,000</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[24%]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
