import { BaseProvider, Action, Trigger } from "../base.provider";

export class OpenTableProvider extends BaseProvider {
    name = "OpenTable";
    type = "BOOKING";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_reservation",
                name: "New Reservation",
                description: "Triggers when a new table is booked.",
                type: "webhook"
            }
        ];
    }
}
