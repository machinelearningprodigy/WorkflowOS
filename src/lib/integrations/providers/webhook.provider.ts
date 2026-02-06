import { BaseProvider, Action, Trigger } from "../base.provider";

export class WebhookProvider extends BaseProvider {
    name = "Webhooks";
    type = "UTILITY";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "catch_hook",
                name: "Catch Webhook",
                description: "Wait for data to be sent to a unique URL.",
                type: "webhook"
            }
        ];
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: "send_request",
                name: "Send HTTP Request",
                description: "Send a custom HTTP request to any URL.",
                inputs: [
                    { id: "url", name: "URL", type: "string", required: true },
                    { id: "method", name: "Method", type: "string", required: true },
                    { id: "body", name: "JSON Body", type: "string", required: false }
                ]
            }
        ];
    }
}
