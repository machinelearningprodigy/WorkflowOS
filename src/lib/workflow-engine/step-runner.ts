import { VariableParser } from './variable-parser';
import { CodeSandbox } from './code-sandbox';

export interface StepContext {
    stepId: string;
    workflowId: string;
    executionId: string;
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
            // We resolve variables BEFORE the step runs
            // e.g. URL: "{{steps.trigger.body.url}}" -> "https://example.com"
            const parsedInput = VariableParser.parse(inputConfig, context.previousSteps);

            // Only log if not sensitive? For now log everything for debug.
            // logs.push(`Resolved inputs for ${type}: ${JSON.stringify(parsedInput)}`); 

            // 2. Route to Handler
            switch (type) {
                case 'code': // Custom JS Code
                    return await this.runCodeStep(parsedInput, context, logs);

                case 'http': // Global HTTP Request
                    return await this.runHttpStep(parsedInput, logs);

                case 'wait': // Delay
                    return await this.runWaitStep(parsedInput, logs);

                case 'trigger': // Trigger node usually just passes data through
                    return { success: true, output: parsedInput, logs: ['Trigger payload passed'] };

                default:
                    // Here we would delegate to the specific Integration Provider
                    // e.g. Slack, Gmail, etc.
                    // For now, return mock success
                    logs.push(`Executed mock action for ${type}/${action}`);
                    return {
                        success: true,
                        output: { mock: true, type, action, input: parsedInput },
                        logs
                    };
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
