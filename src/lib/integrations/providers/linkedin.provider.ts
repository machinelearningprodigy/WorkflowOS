import { BaseProvider, Action, Trigger } from "../base.provider";

export class LinkedInProvider extends BaseProvider {
    name = "LinkedIn";
    type = "SOCIAL";

    getAvailableActions(): Action[] {
        return [
            {
                id: "share_update",
                name: "Share Update",
                description: "Post a status update to LinkedIn.",
                inputs: [
                    { id: "text", name: "Update Text", type: "string", required: true }
                ]
            }
        ];
    }
}
