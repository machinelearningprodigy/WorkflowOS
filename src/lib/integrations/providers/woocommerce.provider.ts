import { BaseProvider, Action, Trigger } from "../base.provider";

export class WooCommerceProvider extends BaseProvider {
    name = "WooCommerce";
    type = "ECOMMERCE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "update_product",
                name: "Update Product",
                description: "Change details of an existing product.",
                inputs: [
                    { id: "productId", name: "Product ID", type: "string", required: true },
                    { id: "stockStatus", name: "Stock Status", type: "string", required: false }
                ]
            }
        ];
    }
}
