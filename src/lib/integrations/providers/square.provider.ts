import { BaseProvider, Action, Trigger } from "../base.provider";

export class SquareProvider extends BaseProvider {
    name = "Square";
    type = "PAYMENT";

    getAvailableActions(): Action[] {
        return [
            {
                id: "list_payments",
                name: "List Payments",
                description: "Get a list of recent payments.",
                inputs: []
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "payment_created",
                name: "Payment Created",
                description: "Triggers when a new payment is processed.",
                type: "webhook"
            }
        ];
    }
}
