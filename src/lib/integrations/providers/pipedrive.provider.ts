import { BaseProvider, Action, Trigger } from "../base.provider";

export class PipedriveProvider extends BaseProvider {
    name = "Pipedrive";
    type = "CRM";

    getAvailableActions(): Action[] {
        return [
            {
                id: "add_person",
                name: "Add Person",
                description: "Create a new contact person in Pipedrive.",
                inputs: [
                    { id: "name", name: "Name", type: "string", required: true },
                    { id: "email", name: "Email", type: "string", required: false }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "deal_added",
                name: "Deal Added",
                description: "Triggers when a new deal is created.",
                type: "webhook"
            }
        ];
    }
}
