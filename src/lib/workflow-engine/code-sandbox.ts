export class CodeSandbox {
    static async run(code: string, context: Record<string, any>): Promise<any> {
        // WARNING: This is a basic implementation using Function constructor.
        // It provides a separate scope but DOES NOT fully isolate the process.
        // In a production environment, use 'isolated-vm' or a separate microservice.

        try {
            // Create a function that takes 'context' and returns an async execution
            // We destructure likely used variables from context for easier access
            const func = new Function('context', `
                return (async () => {
                    const { steps, trigger, env } = context;
                    try {
                        ${code}
                    } catch (e) {
                        throw e;
                    }
                })();
            `);

            // 5-second timeout for execution
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Execution timed out (5000ms limit)')), 5000)
            );

            const result = await Promise.race([
                func(context),
                timeoutPromise
            ]);

            return result;
        } catch (error: any) {
            console.error('[CodeSandbox] Execution failed:', error);
            throw new Error(`Code execution failed: ${error.message}`);
        }
    }
}
