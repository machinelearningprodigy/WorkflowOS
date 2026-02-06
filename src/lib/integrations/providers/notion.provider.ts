import { BaseProvider, Action, TokenResponse } from '../base.provider';

export class NotionProvider extends BaseProvider {
    name = 'Notion';
    type = 'PRODUCTIVITY';

    private clientId = process.env.NOTION_CLIENT_ID!;
    private clientSecret = process.env.NOTION_CLIENT_SECRET!;

    getAuthUrl(redirectUri: string, state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            owner: 'user',
            state,
        });
        return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const response = await fetch('https://api.notion.com/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Notion OAuth Error: ${data.error_description || data.error}`);
        }

        return {
            accessToken: data.access_token,
            providerUserId: data.workspace_id,
            profile_data: {
                workspace_name: data.workspace_name,
                workspace_icon: data.workspace_icon,
                bot_id: data.bot_id,
            }
        } as any;
    }

    async testConnection(accessToken: string): Promise<boolean> {
        const response = await fetch('https://api.notion.com/v1/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28',
            },
        });
        return response.ok;
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'create_page',
                name: 'Create Page',
                description: 'Create a new page in a database',
                inputs: [
                    { id: 'databaseId', name: 'Database ID', type: 'string', required: true },
                    { id: 'title', name: 'Page Title', type: 'string', required: true }
                ]
            },
            {
                id: 'append_block',
                name: 'Append Block',
                description: 'Append content to a page',
                inputs: [
                    { id: 'pageId', name: 'Page ID', type: 'string', required: true },
                    { id: 'content', name: 'Content', type: 'string', required: true }
                ]
            }
        ];
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        const baseUrl = 'https://api.notion.com/v1';
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
        };

        if (action === 'create_page') {
            const response = await fetch(`${baseUrl}/pages`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    parent: { database_id: config.databaseId },
                    properties: {
                        title: [
                            {
                                text: { content: config.title }
                            }
                        ]
                    }
                })
            });
            return await response.json();
        }

        if (action === 'append_block') {
            const response = await fetch(`${baseUrl}/blocks/${config.pageId}/children`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    children: [
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                rich_text: [{ type: 'text', text: { content: config.content } }]
                            }
                        }
                    ]
                })
            });
            return await response.json();
        }

        throw new Error(`Unknown action: ${action}`);
    }
}
