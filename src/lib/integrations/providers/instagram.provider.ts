import { BaseProvider, Action, Trigger } from "../base.provider";

export class InstagramProvider extends BaseProvider {
    name = "Instagram for Business";
    type = "SOCIAL";

    getAvailableActions(): Action[] {
        return [
            {
                id: "publish_photo",
                name: "Publish Photo",
                description: "Post a photo to your business account.",
                inputs: [
                    { id: "imageUrl", name: "Image URL", type: "string", required: true },
                    { id: "caption", name: "Caption", type: "string", required: false }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_media",
                name: "New Media Posted",
                description: "Triggers when you post new content.",
                type: "webhook"
            }
        ];
    }
}
