import { BaseProvider, Action, Trigger } from "../base.provider";

export class QuickBooksProvider extends BaseProvider {
    name = "QuickBooks Online";
    type = "ACCOUNTING";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_invoice",
                name: "Create Invoice",
                description: "Generate a new invoice in QuickBooks.",
                inputs: [
                    { id: "customerId", name: "Customer ID", type: "string", required: true },
                    { id: "amount", name: "Amount", type: "number", required: true }
                ]
            }
        ];
    }
}