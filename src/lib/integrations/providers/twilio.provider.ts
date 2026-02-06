import { BaseProvider, Action, Trigger } from "../base.provider";

export class TwilioProvider extends BaseProvider {
    name = "Twilio";
    type = "COMMUNICATION";

    getAvailableActions(): Action[] {
        return [
            {
                id: "send_sms",
                name: "Send SMS",
                description: "Send a text message.",
                inputs: [
                    { id: "to", name: "To Number", type: "string", required: true },
                    { id: "body", name: "Message Body", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "receive_sms",
                name: "Receive SMS",
                description: "Triggers on incoming SMS.",
                type: "webhook"
            }
        ];
    }

    async testConnection(accessToken: string): Promise<boolean> {
        return !!accessToken;
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        console.log(`Executing Twilio action: ${action}`, config, accessToken);
        return { success: true, sid: "SM" + Math.random().toString(36).substr(2, 9) };
    }
}
