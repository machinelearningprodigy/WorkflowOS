import { BaseProvider, Action, Trigger } from "../base.provider";

export class ToastPosProvider extends BaseProvider {
    name = "Toast POS";
    type = "POS";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "order_placed",
                name: "Order Placed",
                description: "Triggers when a new order is received at the POS.",
                type: "webhook"
            }
        ];
    }
}
