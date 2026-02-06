import { BaseProvider, Action } from "../base.provider";

export class GoogleGeminiProvider extends BaseProvider {
    name = "Google Gemini";
    type = "AI";
    public slug = 'google-gemini';
    authType: 'api_key' = 'api_key';

    async testConnection(apiKey: string): Promise<boolean> {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            return response.ok;
        } catch {
            return false;
        }
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: "generate_content",
                name: "Generate Text",
                description: "Generate content using Gemini AI models.",
                inputs: [
                    { id: "prompt", name: "Prompt", type: "string", required: true },
                    {
                        id: "model", name: "Model", type: "select", required: true, options: [
                            { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
                            { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" }
                        ]
                    }
                ]
            }
        ];
    }
}
