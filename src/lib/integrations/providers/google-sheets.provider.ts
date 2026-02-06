import { BaseProvider, Action, Trigger, TokenResponse } from '../base.provider';

export class GoogleSheetsProvider extends BaseProvider {
    name = 'Google Sheets';
    type = 'google-sheets';

    getAuthUrl(redirectUri: string, state: string): string {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const scope = 'https://www.googleapis.com/auth/spreadsheets';
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            scope: data.scope,
            providerUserId: 'me',
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refresh_token: refreshToken,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
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
                // Convert comma separated string to array for values if strictly simple types
                // or assume defaults. For this mock, we assume config.values is a string
                const values = Array.isArray(config.values) ? config.values : config.values.split(',').map((s: string) => s.trim());
                return this.addRow({ ...config, values }, accessToken);
            case 'get_rows':
                return this.getRows(config, accessToken);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    private async addRow(params: { spreadsheetId: string, range: string, values: string[] }, accessToken: string) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${params.range}:append?valueInputOption=USER_ENTERED`;

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
}
