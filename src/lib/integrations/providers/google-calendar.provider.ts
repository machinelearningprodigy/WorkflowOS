import { BaseProvider, Action, Trigger } from "../base.provider";

export class GoogleCalendarProvider extends BaseProvider {
    name = "Google Calendar";
    type = "CALENDAR";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_event",
                name: "Create Event",
                description: "Add a new event to your calendar.",
                inputs: [
                    { id: "summary", name: "Summary", type: "string", required: true },
                    { id: "startTime", name: "Start Time", type: "string", required: true },
                    { id: "endTime", name: "End Time", type: "string", required: true },
                    { id: "description", name: "Description", type: "string", required: false }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "event_started",
                name: "Event Started",
                description: "Triggers when a calendar event begins.",
                type: "polling"
            }
        ];
    }
}
