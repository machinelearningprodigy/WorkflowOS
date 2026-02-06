// AI service for workflow generation and suggestions
// Uses Hugging Face

import { hf, HF_MODEL } from '../huggingface';

/**
 * Generate workflow from natural language description
 */
export async function generateWorkflowFromDescription(
    description: string,
    industry?: string
): Promise<any> {
    try {
        const systemPrompt = `You are an expert workflow automation assistant. Generate a detailed workflow configuration from this description.

Return a JSON object with:
- name: workflow name
- description: detailed description
- triggerType: one of MANUAL, SCHEDULE, WEBHOOK, EMAIL, FORM_SUBMISSION
- triggerConfig: configuration for the trigger
- steps: array of workflow steps with actions

Each step should have:
- id: unique identifier
- name: step name
- action: action type (send_email, update_spreadsheet, etc.)
- config: action configuration
- condition: optional condition for execution

Make it practical and ready to use. Output ONLY the JSON object.`;

        const response = await hf.chatCompletion({
            model: HF_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Description: ${description}\nIndustry: ${industry || 'General'}` }
            ],
            max_tokens: 2048,
        });

        const content = response.choices[0].message.content;
        const jsonStr = content?.replace(/```json\n?|\n?```/g, "").trim();
        return jsonStr ? JSON.parse(jsonStr) : null;
    } catch (error) {
        console.error('AI workflow generation error:', error);
        throw new Error('Failed to generate workflow');
    }
}

/**
 * Get optimization suggestions for existing workflow
 */
export async function getWorkflowOptimizations(workflow: any): Promise<string[]> {
    try {
        const systemPrompt = `Analyze the provided workflow and provide 3-5 specific, actionable suggestions to improve efficiency, reduce errors, or add useful features. Return as a JSON array of strings. Output ONLY the JSON array.`;

        const response = await hf.chatCompletion({
            model: HF_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify(workflow, null, 2) }
            ],
            max_tokens: 1024,
        });

        const content = response.choices[0].message.content;
        const jsonStr = content?.replace(/```json\n?|\n?```/g, "").trim();
        return jsonStr ? JSON.parse(jsonStr) : [];
    } catch (error) {
        console.error('AI optimization error:', error);
        return [];
    }
}

/**
 * Explain workflow in plain English
 */
export async function explainWorkflow(workflow: any): Promise<string> {
    try {
        const systemPrompt = `Explain the provided workflow in simple, plain English that a non-technical person can understand. Focus on what it does, when it runs, and what the outcome is.`;

        const response = await hf.chatCompletion({
            model: HF_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify(workflow, null, 2) }
            ],
            max_tokens: 1024,
        });

        return response.choices[0].message.content || '';
    } catch (error) {
        console.error('AI explanation error:', error);
        return 'Unable to generate explanation';
    }
}

/**
 * Explain error in simple terms and suggest fixes
 */
export async function explainError(
    error: string,
    context?: any
): Promise<{ explanation: string; suggestedFix: string }> {
    try {
        const systemPrompt = `Explain the provided error in simple terms and suggest how to fix it. Return as a JSON with keys "explanation" and "suggestedFix". Output ONLY the JSON object.`;

        const response = await hf.chatCompletion({
            model: HF_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Error: ${error}\nContext: ${context ? JSON.stringify(context, null, 2) : 'None'}` }
            ],
            max_tokens: 1024,
        });

        const content = response.choices[0].message.content;
        const jsonStr = content?.replace(/```json\n?|\n?```/g, "").trim();
        return jsonStr ? JSON.parse(jsonStr) : { explanation: 'Unable to explain error', suggestedFix: 'Please check the error logs' };
    } catch (error) {
        console.error('AI error explanation error:', error);
        return {
            explanation: 'Unable to explain error',
            suggestedFix: 'Please check the error logs',
        };
    }
}

/**
 * Chat with AI assistant
 */
export async function chatWithAssistant(
    message: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string> {
    try {
        const response = await hf.chatCompletion({
            model: HF_MODEL,
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant for WorkflowOS.' },
                ...(conversationHistory || []),
                { role: 'user', content: message }
            ],
            max_tokens: 1024,
        });

        return response.choices[0].message.content || '';
    } catch (error) {
        console.error('AI chat error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}
