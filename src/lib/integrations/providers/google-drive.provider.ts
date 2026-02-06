import { BaseProvider, Action, TokenResponse } from "../base.provider";

export class GoogleDriveProvider extends BaseProvider {
    name = "Google Drive";
    type = "STORAGE";

    private clientId = process.env.GOOGLE_CLIENT_ID!;
    private clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    private scopes = [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file',
    ];

    getAuthUrl(redirectUri: string, state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: this.scopes.join(' '),
            access_type: 'offline',
            prompt: 'consent',
            state,
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_description || data.error);

        // Fetch user info as providerUserId
        const aboutResponse = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const about = await aboutResponse.json();

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            providerUserId: about.user.emailAddress,
        };
    }

    async testConnection(accessToken: string): Promise<boolean> {
        const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.ok;
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: "list_files",
                name: "List Files",
                description: "List files in your Google Drive.",
                inputs: [
                    { id: "pageSize", name: "Max Results", type: "number", required: false }
                ]
            }
        ];
    }
}
