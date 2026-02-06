import { VariableParser } from './variable-parser';
import { CodeSandbox } from './code-sandbox';
import { getProvider } from '@/lib/integrations/registry';
import { createClient } from '@/lib/supabase/server';

export interface StepContext {
    stepId: string;
    workflowId: string;
    executionId: string;
    userId: string; // Required for integrations
    input: any; // Raw input config from the node
    environment: Record<string, string>;
    previousSteps: Record<string, any>;
}

export interface StepResult {
    success: boolean;
    output?: any;
    error?: string;
    logs: string[];
}

export class StepRunner {
    static async execute(
        type: string,
        action: string,
        inputConfig: any,
        context: StepContext
    ): Promise<StepResult> {
        const logs: string[] = [];

        try {
            // 1. Parse Interpolations in Input
            const parsedInput = VariableParser.parse(inputConfig, context.previousSteps);

            // 2. Route to Handler
            switch (type) {
                case 'code': // Custom JS Code
                    return await this.runCodeStep(parsedInput, context, logs);

                case 'http': // Global HTTP Request
                    return await this.runHttpStep(parsedInput, logs);

                case 'wait': // Delay
                    return await this.runWaitStep(parsedInput, logs);

                case 'trigger': // Trigger node
                    return { success: true, output: parsedInput, logs: ['Trigger payload passed'] };

                case 'manual-trigger':
                    return { success: true, output: parsedInput, logs: ['Manual trigger executed'] };

                default:
                    // Integration Provider Execution
                    const provider = getProvider(type);
                    if (!provider) {
                        // Fallback for unknown types if any
                        logs.push(`Unknown provider type: ${type}. Executing as mock.`);
                        return {
                            success: true,
                            output: { mock: true, type, action, input: parsedInput },
                            logs
                        };
                    }

                    logs.push(`Executing action ${action} for provider ${provider.name}`);

                    if (!context.userId) {
                        throw new Error("User ID missing in execution context. Cannot execute integration.");
                    }

                    // Fetch Connection
                    const supabase = createClient();
                    const { data: connection, error: connError } = await supabase
                        .from('connections')
                        .select('*') // Get everything for refresh if needed
                        .eq('user_id', context.userId)
                        .eq('provider_slug', type)
                        .eq('status', 'connected')
                        .single();

                    if (connError || !connection) {
                        throw new Error(`Connection not found for ${provider.name}. Please reconnect.`);
                    }

                    let accessToken = connection.access_token;

                    // Execute with retry logic for token expiry
                    try {
                        const result = await provider.executeAction(action || 'default', parsedInput, accessToken);
                        logs.push(`Action completed successfully`);
                        return { success: true, output: result, logs };
                    } catch (actionError: any) {
                        // If it's a 401, try to refresh and retry once
                        if ((actionError.message?.includes('401') || actionError.message?.includes('expired')) && connection.refresh_token) {
                            logs.push(`Token expired, attempting refresh...`);
                            try {
                                const tokens = await provider.refreshAccessToken(connection.refresh_token, {
                                    clientId: connection.client_id,
                                    clientSecret: connection.client_secret
                                });

                                // Update DB
                                await supabase
                                    .from('connections')
                                    .update({
                                        access_token: tokens.accessToken,
                                        refresh_token: tokens.refreshToken || connection.refresh_token,
                                        expires_at: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
                                        updated_at: new Date().toISOString()
                                    })
                                    .eq('id', connection.id);

                                logs.push(`Token refreshed, retrying action...`);
                                const retryResult = await provider.executeAction(action || 'default', parsedInput, tokens.accessToken);
                                logs.push(`Action completed successfully after refresh`);
                                return { success: true, output: retryResult, logs };
                            } catch (refreshError: any) {
                                throw new Error(`Integration Error (Refresh Failed): ${refreshError.message}`);
                            }
                        }
                        throw new Error(`Integration Error: ${actionError.message}`);
                    }
            }

        } catch (error: any) {
            logs.push(`Error: ${error.message}`);
            return {
                success: false,
                error: error.message,
                logs
            };
        }
    }

    private static async runCodeStep(input: any, context: StepContext, logs: string[]): Promise<StepResult> {
        logs.push('Executing custom code...');
        try {
            // Context for the code includes previous steps and environment
            const codeContext = {
                steps: context.previousSteps,
                env: context.environment,
                input: input
            };

            const result = await CodeSandbox.run(input.code, codeContext);
            logs.push('Code executed successfully');
            return { success: true, output: result, logs };
        } catch (e: any) {
            throw new Error(`Code Error: ${e.message}`);
        }
    }

    private static async runWaitStep(input: any, logs: string[]): Promise<StepResult> {
        const ms = input.duration || 1000;
        logs.push(`Waiting for ${ms}ms...`);
        await new Promise(resolve => setTimeout(resolve, ms));
        return { success: true, output: { waitedMs: ms }, logs };
    }

    private static async runHttpStep(input: any, logs: string[]): Promise<StepResult> {
        // Implement simple fetch
        try {
            const { url, method = 'GET', headers = {}, body } = input;
            logs.push(`Making ${method} request to ${url}`);

            const response = await fetch(url, {
                method,
                headers,
                body: body && typeof body === 'object' ? JSON.stringify(body) : body
            });

            logs.push(`Response Status: ${response.status}`);

            // Try to parse JSON, fallback to text
            let data;
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch {
                data = text;
            }

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${JSON.stringify(data)}`);
            }

            return { success: true, output: data, logs };
        } catch (e: any) {
            throw e;
        }
    }
}
