import { BaseProvider, Action, Trigger, TokenResponse } from '../base.provider';

export class GoogleSheetsProvider extends BaseProvider {
    name = 'Google Sheets';
    type = 'SPREADSHEET';

    private clientId = process.env.GOOGLE_CLIENT_ID;
    private clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    public slug = 'google-sheets';

    private scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
    ];

    override isConfigured(): boolean {
        return !!this.clientId && !!this.clientSecret;
    }

    getAuthUrl(redirectUri: string, state: string, overrides?: { clientId?: string }): string {
        const clientId = (overrides?.clientId || this.clientId) as string;
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: this.scopes.join(' '),
            access_type: 'offline',
            prompt: 'consent',
            state,
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        const clientId = (overrides?.clientId || this.clientId) as string;
        const clientSecret = (overrides?.clientSecret || this.clientSecret) as string;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_description || data.error || 'Failed to exchange code for token');

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            scope: data.scope,
            providerUserId: 'me',
        };
    }

    async refreshAccessToken(refreshToken: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        const clientId = (overrides?.clientId || this.clientId) as string;
        const clientSecret = (overrides?.clientSecret || this.clientSecret) as string;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        return {
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token || refreshToken
        };
    }

    async testConnection(accessToken: string): Promise<boolean> {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken);
            return response.ok;
        } catch (e) {
            return false;
        }
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'add_row',
                name: 'Add Row',
                description: 'Append a new row of data to a spreadsheet',
                inputs: [
                    { id: 'spreadsheetId', name: 'Spreadsheet ID', type: 'string', required: true },
                    { id: 'range', name: 'Sheet Name or Range', type: 'string', required: true },
                    { id: 'values', name: 'Row Values (Comma Separated)', type: 'string', required: true }
                ]
            },
            {
                id: 'get_rows',
                name: 'Get Rows',
                description: 'Read rows from a spreadsheet',
                inputs: [
                    { id: 'spreadsheetId', name: 'Spreadsheet ID', type: 'string', required: true },
                    { id: 'range', name: 'Range', type: 'string', required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [];
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        switch (action) {
            case 'add_row':
                let values: any[] = [];

                if (Array.isArray(config.values)) {
                    values = config.values;
                } else if (typeof config.values === 'string') {
                    try {
                        const parsed = JSON.parse(config.values);
                        if (Array.isArray(parsed)) {
                            values = parsed;
                        } else {
                            values = [parsed]; // fallback if json but not array
                        }
                    } catch (e) {
                        // Not JSON, fall back to simple CSV split
                        values = config.values.split(',').map((s: string) => s.trim());
                    }
                }

                return this.addRow({ ...config, values }, accessToken);
            case 'get_rows':
                return this.getRows(config, accessToken);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    private async addRow(params: { spreadsheetId: string, range: string, values: string[] }, accessToken: string) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${encodeURIComponent(params.range)}:append?valueInputOption=USER_ENTERED`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [params.values]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Google Sheets API Error: ${error}`);
        }

        return await response.json();
    }

    private async getRows(params: { spreadsheetId: string, range: string }, accessToken: string) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${params.range}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Google Sheets API Error: ${error}`);
        }

        return await response.json();
    }

    async listSpreadsheets(accessToken: string): Promise<Array<{ id: string, name: string }>> {
        const q = "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
        const params = new URLSearchParams({
            q,
            fields: 'files(id,name)',
            pageSize: '100'
        });

        const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Google Drive API Error: ${error}`);
        }

        const data = await response.json();
        return data.files || [];
    }

    async getWorksheets(spreadsheetId: string, accessToken: string): Promise<Array<{ id: string, name: string }>> {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title,sheets.properties.sheetId`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Google Sheets API Error: ${error}`);
        }

        const data = await response.json();
        return data.sheets.map((sheet: any) => ({
            id: sheet.properties.title, // Use title as ID for convenience in range construction
            name: sheet.properties.title
        }));
    }
}
