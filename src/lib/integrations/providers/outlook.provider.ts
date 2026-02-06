import { BaseProvider, Action, Trigger } from "../base.provider";

export class OutlookProvider extends BaseProvider {
    name = "Outlook Calendar";
    type = "CALENDAR";

    getAvailableActions(): Action[] {
        return [
            {
                id: "send_mail",
                name: "Send Email",
                description: "Send an email via Outlook.",
                inputs: [
                    { id: "to", name: "To", type: "string", required: true },
                    { id: "subject", name: "Subject", type: "string", required: true },
                    { id: "body", name: "Body", type: "string", required: true }
                ]
            }
        ];
    }
}
