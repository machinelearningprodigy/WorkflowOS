import { VariableParser } from './variable-parser';

export type Operator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'isEmpty'
    | 'isNotEmpty';

export class ConditionEvaluator {
    static evaluate(
        condition: {
            left: any;
            operator: Operator;
            right?: any;
        },
        context: any
    ): boolean {
        const leftValue = VariableParser.parse(condition.left, context);
        // rightValue might also contain variables
        const rightValue = condition.right ? VariableParser.parse(condition.right, context) : undefined;

        switch (condition.operator) {
            case 'equals':
                return leftValue == rightValue; // loose equality
            case 'notEquals':
                return leftValue != rightValue;
            case 'contains':
                return String(leftValue).includes(String(rightValue));
            case 'notContains':
                return !String(leftValue).includes(String(rightValue));
            case 'greaterThan':
                return Number(leftValue) > Number(rightValue);
            case 'lessThan':
                return Number(leftValue) < Number(rightValue);
            case 'greaterThanOrEqual':
                return Number(leftValue) >= Number(rightValue);
            case 'lessThanOrEqual':
                return Number(leftValue) <= Number(rightValue);
            case 'isEmpty':
                return leftValue === null || leftValue === undefined || leftValue === '';
            case 'isNotEmpty':
                return !(leftValue === null || leftValue === undefined || leftValue === '');
            default:
                return false;
        }
    }

    static evaluateGroup(
        conditions: any[],
        logic: 'AND' | 'OR' = 'AND',
        context: any
    ): boolean {
        if (!conditions || !conditions.length) return true;

        if (logic === 'AND') {
            return conditions.every(c => this.evaluate(c, context));
        } else {
            return conditions.some(c => this.evaluate(c, context));
        }
    }
}
