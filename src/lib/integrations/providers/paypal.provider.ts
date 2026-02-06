import { BaseProvider, Action, Trigger } from "../base.provider";

export class PayPalProvider extends BaseProvider {
    name = "PayPal";
    type = "PAYMENT";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "payment_received",
                name: "Payment Received",
                description: "Triggers when a PayPal payment is completed.",
                type: "webhook"
            }
        ];
    }
}
