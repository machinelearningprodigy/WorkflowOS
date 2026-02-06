import { BaseProvider, Action, Trigger } from "../base.provider";

export class ZillowProvider extends BaseProvider {
    name = "Zillow";
    type = "REAL_ESTATE";

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_listing",
                name: "New Listing",
                description: "Triggers when a new listing matches your criteria.",
                type: "webhook"
            }
        ];
    }
}
