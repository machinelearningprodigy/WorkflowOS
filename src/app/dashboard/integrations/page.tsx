'use client'

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle2, Loader2, Link2, ExternalLink, ShieldCheck, XCircle } from "lucide-react"
import { trpc } from "@/utils/trpc"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const PROVIDER_ICONS: Record<string, string> = {
    'gmail': "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    'slack': "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    'github': "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    'discord': "https://upload.wikimedia.org/wikipedia/commons/7/71/Discord_Logo_Sans_Logo.svg",
    'google-sheets': "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
    'notion': "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg",
    'stripe': "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    'twilio': "https://upload.wikimedia.org/wikipedia/commons/7/72/Twilio_logo.svg",
    'google-drive': "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
    'airtable': "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    'hubspot': "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
    'shopify': "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    'quickbooks': "https://upload.wikimedia.org/wikipedia/commons/b/bd/QuickBooks_logo.svg",
    'salesforce': "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    'zoom': "https://upload.wikimedia.org/wikipedia/commons/f/f7/Zoom_Video_Communications_logo.svg",
    'dropbox': "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg",
    'whatsapp': "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    'paypal': "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
};

export default function IntegrationsPage() {
    const { toast } = useToast()
    const utils = trpc.useContext()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")

    // For API Key Dialog
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<any>(null)
    const [apiKey, setApiKey] = useState("")
    const [isConnecting, setIsConnecting] = useState(false)

    // Data Queries
    const { data: providers = [], isLoading: providersLoading } = trpc.integration.getProviders.useQuery()
    const { data: connections = [], isLoading: connectionsLoading } = trpc.integration.list.useQuery()

    // Mutations
    const oauthMutation = trpc.integration.getOAuthUrl.useMutation()
    const disconnectMutation = trpc.integration.disconnect.useMutation({
        onSuccess: () => {
            toast({ title: "Disconnected successfully" })
            utils.integration.list.invalidate()
        }
    })

    const categories = useMemo(() => {
        const cats = new Set(["All"])
        providers.forEach(p => cats.add(p.type))
        return Array.from(cats)
    }, [providers])

    const filteredProviders = useMemo(() => {
        return providers.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.slug.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = activeCategory === "All" || p.type === activeCategory
            return matchesSearch && matchesCategory
        })
    }, [providers, searchTerm, activeCategory])

    const handleConnect = async (provider: any) => {
        if (provider.auth_type === 'api_key') {
            setSelectedProvider(provider)
            setApiKeyDialogOpen(true)
            return
        }

        try {
            const { url } = await oauthMutation.mutateAsync({ provider: provider.slug })
            if (url) {
                window.location.href = url
            } else {
                toast({ title: "OAuth Not Configured", description: `Please set up environment variables for ${provider.name}`, variant: "destructive" })
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" })
        }
    }

    const testConnectionMutation = trpc.integration.testConnection.useMutation({
        onSuccess: (data) => {
            if (data.success) {
                toast({ title: "Connection working!", description: data.refreshed ? "Token was automatically refreshed." : "Verification successful." })
                utils.integration.list.invalidate()
            } else {
                toast({ title: "Connection failed", description: "Please try reconnecting.", variant: "destructive" })
                utils.integration.list.invalidate()
            }
        }
    })

    const handleTest = (slug: string) => {
        const connection = connections.find(c => c.provider_slug === slug)
        if (connection) {
            testConnectionMutation.mutate({ id: connection.id })
        }
    }

    const handleDisconnect = (slug: string) => {
        const connection = connections.find(c => c.provider_slug === slug)
        if (connection && confirm(`Disconnect ${connection.display_name}?`)) {
            disconnectMutation.mutate({ id: connection.id })
        }
    }

    const connectApiKeyMutation = trpc.integration.connectApiKey.useMutation({
        onSuccess: () => {
            toast({ title: "Connected!", description: `${selectedProvider.name} is now ready to use.` })
            setApiKeyDialogOpen(false)
            setApiKey("")
            utils.integration.list.invalidate()
        },
        onError: (err) => {
            toast({ title: "Connection Failed", description: err.message, variant: "destructive" })
        }
    })

    const submitApiKey = async () => {
        if (!apiKey || !selectedProvider) return
        connectApiKeyMutation.mutate({
            provider: selectedProvider.slug,
            apiKey: apiKey
        })
    }

    if (providersLoading || connectionsLoading) {
        return (
            <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Integrations</h2>
                    <p className="text-muted-foreground font-medium">
                        Connect your ecosystem. Bridge the gap between your favorite platforms.
                    </p>
                </div>
                <Button variant="outline" className="rounded-xl px-6 border-slate-200">
                    Request Custom Node
                </Button>
            </header>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search 100+ integrations..."
                        className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus-visible:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeCategory === cat
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProviders.map((provider) => {
                    const connection = connections.find(c => c.provider_slug === provider.slug)
                    const isConnected = !!connection

                    return (
                        <Card key={provider.slug} className={`flex flex-col group transition-all duration-300 border-slate-100 rounded-3xl ${isConnected ? 'bg-indigo-50/30 border-indigo-100 ring-1 ring-indigo-100' : 'hover:shadow-xl hover:-translate-y-1 bg-white'
                            }`}>
                            <CardHeader className="flex-row gap-5 items-start space-y-0 p-6 pb-4">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center p-3 border shadow-sm transition-transform group-hover:scale-110 ${isConnected ? 'bg-white border-indigo-200' : 'bg-slate-50 border-slate-100'
                                    }`}>
                                    <img
                                        src={PROVIDER_ICONS[provider.slug] || `https://ui-avatars.com/api/?name=${provider.name}&background=6366f1&color=fff`}
                                        alt={provider.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-bold text-slate-800 truncate">{provider.name}</CardTitle>
                                        {isConnected && (
                                            <div className="bg-indigo-500 rounded-full p-0.5 shadow-sm">
                                                <CheckCircle2 className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <Badge variant="outline" className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border-slate-100">
                                        {provider.type}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between gap-6 p-6 pt-0">
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                    {provider.description || `Automate tasks with ${provider.name} and sync data across your workflow.`}
                                </p>
                                <div className="space-y-3">
                                    {isConnected ? (
                                        <>
                                            <div className="flex items-center justify-between text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
                                                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Securely Connected</span>
                                                <span>Active</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 text-xs font-bold text-slate-600 border-slate-200 rounded-xl h-10"
                                                    onClick={() => handleTest(provider.slug)}
                                                    disabled={testConnectionMutation.isLoading}
                                                >
                                                    {testConnectionMutation.isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ShieldCheck className="h-3 w-3 mr-2" />}
                                                    Test
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 rounded-xl h-10"
                                                    onClick={() => handleDisconnect(provider.slug)}
                                                    disabled={disconnectMutation.isLoading}
                                                >
                                                    {disconnectMutation.isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <XCircle className="h-3 w-3 mr-2" />}
                                                    Disconnect
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <Button
                                            className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-10 font-bold text-xs"
                                            onClick={() => handleConnect(provider)}
                                            disabled={oauthMutation.isLoading}
                                        >
                                            {oauthMutation.isLoading && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                                            <Link2 className="h-3 w-3 mr-2 rotate-45" />
                                            Connect {provider.name}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* API Key Connection Dialog */}
            <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 p-2 border">
                                <img src={PROVIDER_ICONS[selectedProvider?.slug]} className="h-full w-full object-contain" />
                            </div>
                            Connect {selectedProvider?.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Enter your API Key to authorize WorkflowOS to access your {selectedProvider?.name} account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="apiKey" className="text-xs font-bold uppercase tracking-widest text-slate-400">API Key / Secret</Label>
                            <Input
                                id="apiKey"
                                type="password"
                                placeholder="sk-..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                Your keys are encrypted using AES-256 before being stored. Never share your secret keys with anyone.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setApiKeyDialogOpen(false)} disabled={isConnecting} className="rounded-xl font-bold">Cancel</Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-indigo-200"
                            onClick={submitApiKey}
                            disabled={isConnecting || !apiKey}
                        >
                            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                            Secure Connection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
