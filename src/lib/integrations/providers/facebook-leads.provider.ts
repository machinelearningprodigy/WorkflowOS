import { BaseProvider, Action, Trigger } from "../base.provider";

export class FacebookLeadsProvider extends BaseProvider {
    name = "Facebook Lead Ads";
    type = "MARKETING";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_lead",
                name: "New Lead",
                description: "Triggers when a new lead is captured via Facebook Ads.",
                type: "webhook"
            }
        ];
    }
}
