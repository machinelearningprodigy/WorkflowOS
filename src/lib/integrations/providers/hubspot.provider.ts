import { BaseProvider, Action, Trigger } from "../base.provider";

export class HubSpotProvider extends BaseProvider {
    name = "HubSpot";
    type = "CRM";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_contact",
                name: "Create Contact",
                description: "Creates a CRM contact.",
                inputs: [
                    { id: "email", name: "Email", type: "string", required: true },
                    { id: "firstname", name: "First Name", type: "string", required: false }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "contact_created",
                name: "New Contact",
                description: "Triggers on contact creation.",
                type: "webhook"
            }
        ];
    }

    async testConnection(accessToken: string): Promise<boolean> {
        return !!accessToken;
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        console.log(`Executing HubSpot action: ${action}`, config, accessToken);
        return { success: true, id: "hs_" + Math.random().toString(36).substr(2, 9) };
    }
}
