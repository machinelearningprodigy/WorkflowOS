import { BaseProvider, Action, Trigger } from "../base.provider";

export class WhatsAppProvider extends BaseProvider {
    name = "WhatsApp Business";
    type = "COMMUNICATION";

    getAvailableActions(): Action[] {
        return [
            {
                id: "send_template",
                name: "Send Template Message",
                description: "Send a pre-approved template message to a customer.",
                inputs: [
                    { id: "to", name: "Phone Number", type: "string", required: true },
                    { id: "templateName", name: "Template Name", type: "string", required: true },
                    { id: "languageCode", name: "Language Code", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "receive_message",
                name: "Message Received",
                description: "Triggers when a customer sends you a message.",
                type: "webhook"
            }
        ];
    }
}
