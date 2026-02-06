import { BaseProvider, Action, Trigger } from "../base.provider";

export class AcuityProvider extends BaseProvider {
    name = "Acuity Scheduling";
    type = "BOOKING";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_appointment",
                name: "Create Appointment",
                description: "Book a new appointment.",
                inputs: [
                    { id: "email", name: "Client Email", type: "string", required: true },
                    { id: "firstName", name: "First Name", type: "string", required: true },
                    { id: "appointmentTypeID", name: "Appointment Type ID", type: "string", required: true },
                    { id: "datetime", name: "Date Time", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_appointment",
                name: "New Appointment",
                description: "Triggers when a new appointment is booked.",
                type: "webhook"
            }
        ];
    }
}
