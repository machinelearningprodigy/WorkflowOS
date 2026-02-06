import { format } from 'date-fns';

export const transformers = {
    // String manipulations
    toJSON: (value: any) => JSON.stringify(value, null, 2),
    toString: (value: any) => String(value),
    toLowerCase: (value: string) => String(value).toLowerCase(),
    toUpperCase: (value: string) => String(value).toUpperCase(),
    trim: (value: string) => String(value).trim(),

    // Number manipulations
    toNumber: (value: any) => Number(value),
    round: (value: number) => Math.round(value),
    ceil: (value: number) => Math.ceil(value),
    floor: (value: number) => Math.floor(value),

    // Date manipulations
    formatDate: (value: string | Date, formatStr: string = 'yyyy-MM-dd') => {
        try {
            return format(new Date(value), formatStr);
        } catch (e) {
            return String(value);
        }
    },

    // Logic / Utilities
    defaultTo: (value: any, defaultValue: any) => (value === undefined || value === null ? defaultValue : value),
    length: (value: any) => (value?.length !== undefined ? value.length : 0),
};

export type TransformerName = keyof typeof transformers;
