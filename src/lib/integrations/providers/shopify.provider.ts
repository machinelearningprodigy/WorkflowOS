import { BaseProvider, Action, Trigger } from "../base.provider";

export class ShopifyProvider extends BaseProvider {
    name = "Shopify";
    type = "ECOMMERCE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "get_order",
                name: "Get Order",
                description: "Retrieve details for a specific order.",
                inputs: [
                    { id: "orderId", name: "Order ID", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_order",
                name: "New Order",
                description: "Triggers when a new order is placed.",
                type: "webhook"
            }
        ];
    }
}