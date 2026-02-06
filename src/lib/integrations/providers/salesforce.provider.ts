import { BaseProvider, Action, Trigger } from "../base.provider";

export class SalesforceProvider extends BaseProvider {
    name = "Salesforce";
    type = "CRM";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_lead",
                name: "Create Lead",
                description: "Create a new lead in Salesforce Sales Cloud.",
                inputs: [
                    { id: "lastName", name: "Last Name", type: "string", required: true },
                    { id: "company", name: "Company", type: "string", required: true },
                    { id: "email", name: "Email", type: "string", required: false }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "object_updated",
                name: "Object Updated",
                description: "Triggers when a Salesforce record is updated.",
                type: "webhook"
            }
        ];
    }
}
