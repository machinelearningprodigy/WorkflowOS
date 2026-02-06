import { BaseProvider, Action, Trigger } from "../base.provider";

export class TypeformProvider extends BaseProvider {
    name = "Typeform";
    type = "FORMS";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "form_response",
                name: "New Response",
                description: "Triggers when a new Typeform response is submitted.",
                type: "webhook"
            }
        ];
    }
}
