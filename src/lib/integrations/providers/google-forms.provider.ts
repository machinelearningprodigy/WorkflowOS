import { BaseProvider, Action, Trigger } from "../base.provider";

export class GoogleFormsProvider extends BaseProvider {
    name = "Google Forms";
    type = "FORMS";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_response",
                name: "New Response",
                description: "Triggers when a new form response is submitted.",
                type: "webhook"
            }
        ];
    }
}
