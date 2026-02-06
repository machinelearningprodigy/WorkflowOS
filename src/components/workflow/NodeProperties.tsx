'use client'

import React, { useEffect } from 'react'
import { X, Settings, Database, SlidersHorizontal, Info, CheckCircle2, AlertCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { trpc } from '@/utils/trpc'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface NodePropertiesProps {
    selectedNode: any
    onClose: () => void
    onUpdate: (nodeId: string, data: any) => void
    isConnected: boolean
}

export function NodeProperties({ selectedNode, onClose, onUpdate, isConnected }: NodePropertiesProps) {
    if (!selectedNode) return null

    const data = selectedNode.data || {}
    const provider = data.provider || 'Generic'

    // Auto-populate defaults for Google Sheets
    useEffect(() => {
        if (provider === 'google-sheets') {
            const updates: any = {};
            if (!data.range) updates.range = 'Sheet1!A:A';
            if (!data.values) updates.values = '["Value 1", "Value 2"]'; // Optional: don't overwrite if they want emptiness

            if (Object.keys(updates).length > 0) {
                onUpdate(selectedNode.id, updates);
            }
        }
    }, [provider, data.range, selectedNode.id, onUpdate]);

    const { toast } = useToast()
    const utils = trpc.useContext() // If we need to invalidate

    const testStepMutation = trpc.workflow.testStep.useMutation({
        onSuccess: (result) => {
            if (result.success) {
                toast({
                    title: 'Step executed successfully',
                    description: 'Check the destination (e.g. Google Sheet) for the result.',
                    className: 'bg-green-600 text-white border-green-700'
                })
            } else {
                toast({
                    title: 'Step execution failed',
                    description: result.error,
                    variant: 'destructive'
                })
            }
        },
        onError: (err) => {
            toast({ title: 'Test failed', description: err.message, variant: 'destructive' })
        }
    })

    const handleTestStep = () => {
        // Assume 'action' maps to provider-specific default action since UI doesn't allow selecting action yet
        // For Google Sheets, we are inferreding 'add_row' based on fields shown, or we can look at the node implementation logic
        // But for now, let's hardcode action to 'add_row' for google-sheets if likely, or pass a default.
        // Actually, StepRunner expects specific actions. 
        // For V1, the AI set the 'data.action' or we assume a default per provider?

        // Let's determine action based on provider for this test
        let action = data.action;
        if (!action) {
            if (provider === 'google-sheets') action = 'add_row';
            if (provider === 'gmail') action = 'send_email';
            if (provider === 'slack') action = 'send_message';
            // ... defaults
        }

        testStepMutation.mutate({
            workflowId: 'preview', // Or actual ID if available, but for single step test meaningful context might not exist
            nodeId: selectedNode.id,
            type: provider,
            action: action,
            config: data
        })
    }

    const { data: spreadsheets, isLoading: loadingSheets, error: sheetsError } = trpc.integration.listResources.useQuery({
        provider: 'google-sheets',
        resourceType: 'spreadsheets'
    }, {
        enabled: provider.toLowerCase() === 'google-sheets' && isConnected,
        retry: false // Don't retry if it's a permission error
    });

    const { data: worksheets } = trpc.integration.listResources.useQuery({
        provider: 'google-sheets',
        resourceType: 'worksheets',
        parentId: data.spreadsheetId
    }, {
        enabled: provider.toLowerCase() === 'google-sheets' && isConnected && !!data.spreadsheetId,
        retry: false
    });

    return (
        <div className="w-[400px] h-full bg-white/80 backdrop-blur-xl border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Configure Step</h2>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest leading-none mt-1">
                                {provider} Node • {selectedNode.id}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-slate-100">
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 gap-1 px-2.5 py-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Connected
                        </Badge>
                    ) : (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 gap-1 px-2.5 py-1">
                            <AlertCircle className="h-3 w-3" />
                            Needs Connection
                        </Badge>
                    )}
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 px-2.5 py-1">
                        Action Step
                    </Badge>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="settings" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b border-slate-100">
                    <TabsList className="h-12 bg-transparent gap-6 w-full justify-start p-0">
                        <TabsTrigger
                            value="settings"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full px-0 gap-2 text-slate-500 data-[state=active]:text-indigo-600 font-medium"
                        >
                            <Settings className="h-4 w-4" /> Setup
                        </TabsTrigger>
                        <TabsTrigger
                            value="data"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full px-0 gap-2 text-slate-500 data-[state=active]:text-indigo-600 font-medium"
                        >
                            <Database className="h-4 w-4" /> Data
                        </TabsTrigger>
                        <TabsTrigger
                            value="logic"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full px-0 gap-2 text-slate-500 data-[state=active]:text-indigo-600 font-medium"
                        >
                            <SlidersHorizontal className="h-4 w-4" /> Logic
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1 p-6">
                    <TabsContent value="settings" className="m-0 space-y-6">
                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 flex items-start gap-3">
                            <Info className="h-4 w-4 text-indigo-500 mt-0.5" />
                            <p className="text-xs text-indigo-700/80 leading-relaxed">
                                Configure the main parameters for this step. The values you set here will be used during execution.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Step Name</Label>
                                <Input
                                    defaultValue={data.label}
                                    className="bg-white border-slate-200 focus-visible:ring-indigo-500 rounded-lg"
                                    onChange={(e) => onUpdate(selectedNode.id, { label: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</Label>
                                <Textarea
                                    defaultValue={data.description}
                                    className="bg-white border-slate-200 focus-visible:ring-indigo-500 rounded-lg min-h-[80px] resize-none"
                                    onChange={(e) => onUpdate(selectedNode.id, { description: e.target.value })}
                                />
                            </div>

                            {/* Dynamic Fields based on Provider */}
                            {/* Dynamic Fields based on Provider */}
                            {provider.toLowerCase() === 'google-sheets' && (
                                <>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Spreadsheet</Label>

                                        {!isConnected ? (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex gap-2">
                                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                                Please connect Google Sheets integration first.
                                            </div>
                                        ) : sheetsError ? (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                                                <div className="flex gap-2 text-sm text-red-800 font-medium">
                                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                                    Permission Update Required
                                                </div>
                                                <p className="text-xs text-red-600 pl-6">
                                                    {sheetsError.message === 'Missing permissions: Please disconnect and reconnect Google Sheets to allow file listing.'
                                                        ? "We need updated permissions to list your spreadsheets. Please disconnect and reconnect Google Sheets in the Integrations page."
                                                        : sheetsError.message}
                                                </p>
                                                <Input
                                                    placeholder="Or enter ID manually..."
                                                    className="bg-white border-red-200 text-xs h-8"
                                                    value={data.spreadsheetId || ''}
                                                    onChange={(e) => onUpdate(selectedNode.id, { spreadsheetId: e.target.value })}
                                                />
                                            </div>
                                        ) : loadingSheets ? (
                                            <div className="flex items-center gap-2 text-sm text-slate-500 p-2 border rounded-lg bg-slate-50">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
                                                Fetching spreadsheets...
                                            </div>
                                        ) : spreadsheets && spreadsheets.length > 0 ? (
                                            <Select
                                                value={data.spreadsheetId || ''}
                                                onValueChange={(val) => onUpdate(selectedNode.id, { spreadsheetId: val })}
                                            >
                                                <SelectTrigger className="w-full bg-white border-slate-200 rounded-lg shadow-sm">
                                                    <SelectValue placeholder="Select a spreadsheet" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {spreadsheets.map((sheet: any) => (
                                                        <SelectItem key={sheet.id} value={sheet.id} className="cursor-pointer">
                                                            {sheet.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder="e.g. 1BxiMVs0XRA5nFMdKbBdB_7"
                                                    className="bg-white border-slate-200 rounded-lg"
                                                    value={data.spreadsheetId || ''}
                                                    onChange={(e) => onUpdate(selectedNode.id, { spreadsheetId: e.target.value })}
                                                />
                                                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                                    <Info className="h-3 w-3" />
                                                    No spreadsheets found. Enter ID manually.
                                                </p>
                                            </div>
                                        )}
                                        {isConnected && !sheetsError && spreadsheets && spreadsheets.length > 0 && (
                                            <p className="text-[10px] text-slate-500">Select from your Google Drive</p>
                                        )}
                                    </div>
                                    {/* Worksheet Selector */}
                                    {data.spreadsheetId && (
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Worksheet</Label>
                                            <Select
                                                value={data.range ? data.range.split('!')[0] : ''}
                                                onValueChange={(val) => onUpdate(selectedNode.id, { range: `${val}!A:A` })}
                                            >
                                                <SelectTrigger className="w-full bg-white border-slate-200 rounded-lg shadow-sm">
                                                    <SelectValue placeholder="Select a sheet" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {worksheets?.map((sheet: any) => (
                                                        <SelectItem key={sheet.id} value={sheet.name} className="cursor-pointer">
                                                            {sheet.name}
                                                        </SelectItem>
                                                    )) || <div className="p-2 text-xs text-slate-500">Loading sheets...</div>}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Range</Label>
                                        <Input
                                            placeholder="Sheet1!A:A"
                                            className="bg-white border-slate-200 rounded-lg"
                                            value={data.range || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { range: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Values (JSON Array)</Label>
                                        <Textarea
                                            placeholder='["Name", "Email", "Date"]'
                                            className="bg-white border-slate-200 rounded-lg font-mono text-xs"
                                            value={data.values || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { values: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {(provider.toLowerCase() === 'google-gemini' || provider.toLowerCase() === 'gemini') && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Model Name</Label>
                                        <Input
                                            placeholder="gemini-pro"
                                            defaultValue="gemini-pro"
                                            className="bg-white border-slate-200 rounded-lg"
                                            value={data.model || 'gemini-pro'}
                                            onChange={(e) => onUpdate(selectedNode.id, { model: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Prompt</Label>
                                        <Textarea
                                            placeholder="Enter your prompt here..."
                                            className="bg-white border-slate-200 rounded-lg min-h-[120px]"
                                            value={data.prompt || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { prompt: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {provider.toLowerCase() === 'gmail' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recipient Email</Label>
                                        <Input
                                            placeholder="user@example.com"
                                            className="bg-white border-slate-200 rounded-lg"
                                            value={data.to || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { to: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</Label>
                                        <Input
                                            placeholder="Hello from WorkflowOS"
                                            className="bg-white border-slate-200 rounded-lg"
                                            value={data.subject || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Body</Label>
                                        <Textarea
                                            placeholder="Write your message here..."
                                            className="bg-white border-slate-200 rounded-lg min-h-[120px]"
                                            value={data.body || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { body: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {provider.toLowerCase() === 'slack' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Channel</Label>
                                        <Input
                                            placeholder="#general"
                                            className="bg-white border-slate-200 rounded-lg"
                                            value={data.channel || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { channel: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</Label>
                                        <Textarea
                                            placeholder="Type your message..."
                                            className="bg-white border-slate-200 focus-visible:ring-indigo-500 rounded-lg min-h-[100px]"
                                            value={data.message || ''}
                                            onChange={(e) => onUpdate(selectedNode.id, { message: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="data" className="m-0 space-y-6">
                        <div className="text-center py-12">
                            <Database className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 font-medium">Data mapping coming soon</p>
                            <p className="text-xs text-slate-400 mt-1">Connect steps to map output data between them.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="logic" className="m-0 space-y-6">
                        <div className="text-center py-12">
                            <SlidersHorizontal className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 font-medium">Conditional logic coming soon</p>
                            <p className="text-xs text-slate-400 mt-1">Add rules to bypass or modify step execution.</p>
                        </div>
                    </TabsContent>
                </ScrollArea>

                <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-3">
                    <Button
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
                        onClick={onClose}
                    >
                        Save Configuration
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-slate-200 font-semibold h-11 rounded-xl hover:bg-white text-slate-600 gap-2"
                        disabled={!isConnected || testStepMutation.isLoading}
                        onClick={handleTestStep}
                    >
                        {testStepMutation.isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        {testStepMutation.isLoading ? 'Testing...' : 'Test this Step'}
                    </Button>
                </div>
            </Tabs>
        </div>
    )
}
