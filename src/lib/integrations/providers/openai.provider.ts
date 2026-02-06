import { BaseProvider, Action } from "../base.provider";

export class OpenAIProvider extends BaseProvider {
    name = "OpenAI";
    type = "AI";
    override authType: 'api_key' = 'api_key';

    async testConnection(apiKey: string): Promise<boolean> {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'chat_completion',
                name: 'Chat Completion',
                description: 'Generate text using GPT-4 or GPT-3.5',
                inputs: [
                    { id: 'model', name: 'Model', type: 'string', required: true },
                    { id: 'prompt', name: 'Prompt', type: 'string', required: true },
                    { id: 'temperature', name: 'Temperature', type: 'number', required: false }
                ]
            }
        ];
    }

    async executeAction(action: string, config: any, apiKey: string): Promise<any> {
        if (action === 'chat_completion') {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: config.model || 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: config.prompt }],
                    temperature: config.temperature || 0.7
                })
            });
            return await response.json();
        }
        throw new Error(`Unknown action: ${action}`);
    }
}
