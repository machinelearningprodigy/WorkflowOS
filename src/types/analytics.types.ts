/**
 * Analytics related types and charting data structures.
 */

export interface MetricCard {
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: string;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    category?: string;
}

export interface WorkflowUsageStats {
    totalExecutions: number;
    successRate: number;
    avgDuration: number;
    errorsByType: Record<string, number>;
}

export interface IntegrationStats {
    provider: string;
    callCount: number;
    lastUsed: string;
}
