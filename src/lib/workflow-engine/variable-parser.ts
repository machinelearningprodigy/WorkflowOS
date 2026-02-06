import { transformers, TransformerName } from './transformers';

export class VariableParser {
    // Matches {{ variable.path | transformer }}
    private static readonly REGEX = /\{\{\s*([a-zA-Z0-9_$.]+)(?:\s*\|\s*([a-zA-Z0-9_]+))?\s*\}\}/g;

    /**
     * Parse any value (string, object, array) and interpolate variables
     */
    static parse(content: any, context: any): any {
        if (typeof content === 'string') {
            return this.interpolateString(content, context);
        } else if (Array.isArray(content)) {
            return content.map(item => this.parse(item, context));
        } else if (typeof content === 'object' && content !== null) {
            const result: any = {};
            for (const key in content) {
                result[key] = this.parse(content[key], context);
            }
            return result;
        }
        return content;
    }

    private static interpolateString(str: string, context: any): any {
        // If the entire string is just one variable {{ var }}, return the raw value (could be object/number)
        const exactMatch = str.match(/^\{\{\s*([a-zA-Z0-9_$.]+)(?:\s*\|\s*([a-zA-Z0-9_]+))?\s*\}\}$/);
        if (exactMatch) {
            const [_, path, transformer] = exactMatch;
            let value = this.resolvePath(path, context);
            if (transformer && transformers[transformer as TransformerName]) {
                const transformFn = transformers[transformer as TransformerName] as Function;
                value = transformFn(value);
            }
            return value;
        }

        // Otherwise replace all occurrences in the string
        return str.replace(this.REGEX, (_, path, transformer) => {
            let value = this.resolvePath(path, context);

            if (transformer && transformers[transformer as TransformerName]) {
                const transformFn = transformers[transformer as TransformerName] as Function;
                value = transformFn(value);
            }

            return value !== undefined ? String(value) : '';
        });
    }

    private static resolvePath(path: string, context: any): any {
        return path.split('.').reduce((acc, part) => {
            return acc && acc[part] !== undefined ? acc[part] : undefined;
        }, context);
    }
}
