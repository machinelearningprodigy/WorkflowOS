import { BaseProvider, Action, Trigger } from "../base.provider";

export class JotformProvider extends BaseProvider {
    name = "Jotform";
    type = "FORMS";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_submission",
                name: "New Submission",
                description: "Triggers when a new form submission is received.",
                type: "webhook"
            }
        ];
    }
}
