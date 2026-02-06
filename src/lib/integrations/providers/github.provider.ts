import { BaseProvider, Action, TokenResponse } from '../base.provider';

export class GitHubProvider extends BaseProvider {
    name = 'GitHub';
    type = 'DEVELOPER';

    private clientId = process.env.GITHUB_CLIENT_ID!;
    private clientSecret = process.env.GITHUB_CLIENT_SECRET!;

    getAuthUrl(redirectUri: string, state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            scope: 'repo user read:org',
            state,
        });
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`GitHub OAuth Error: ${data.error_description || data.error}`);
        }

        return {
            accessToken: data.access_token,
            scope: data.scope,
            tokenType: data.token_type,
        } as any;
    }

    async testConnection(accessToken: string): Promise<boolean> {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        return response.ok;
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'create_issue',
                name: 'Create Issue',
                description: 'Create a new issue in a repository',
                inputs: [
                    { id: 'owner', name: 'Repo Owner', type: 'string', required: true },
                    { id: 'repo', name: 'Repo Name', type: 'string', required: true },
                    { id: 'title', name: 'Issue Title', type: 'string', required: true },
                    { id: 'body', name: 'Issue Body', type: 'string', required: false },
                ]
            },
            {
                id: 'create_commit_comment',
                name: 'Create Commit Comment',
                description: 'Add a comment to a commit',
                inputs: [
                    { id: 'owner', name: 'Repo Owner', type: 'string', required: true },
                    { id: 'repo', name: 'Repo Name', type: 'string', required: true },
                    { id: 'commit_sha', name: 'Commit SHA', type: 'string', required: true },
                    { id: 'body', name: 'Comment Body', type: 'string', required: true },
                ]
            }
        ];
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        const baseUrl = 'https://api.github.com';
        const headers = {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        };

        if (action === 'create_issue') {
            const response = await fetch(`${baseUrl}/repos/${config.owner}/${config.repo}/issues`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title: config.title,
                    body: config.body
                })
            });
            return await response.json();
        }

        if (action === 'create_commit_comment') {
            const response = await fetch(`${baseUrl}/repos/${config.owner}/${config.repo}/commits/${config.commit_sha}/comments`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    body: config.body
                })
            });
            return await response.json();
        }

        throw new Error(`Unknown action: ${action}`);
    }
}
