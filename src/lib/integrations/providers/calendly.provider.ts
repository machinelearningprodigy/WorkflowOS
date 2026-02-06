import { BaseProvider, Action, Trigger } from "../base.provider";

export class CalendlyProvider extends BaseProvider {
    name = "Calendly";
    type = "BOOKING";

    getAvailableActions(): Action[] {
        return [
            {
                id: "get_event",
                name: "Get Event Details",
                description: "Retrieve details for a specific event.",
                inputs: [
                    { id: "uuid", name: "Event UUID", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "invitee_created",
                name: "Invitee Created",
                description: "Triggers when a new meeting is scheduled.",
                type: "webhook"
            }
        ];
    }
}
