import { BaseProvider, Action, Trigger } from "../base.provider";

export class ServiceTitanProvider extends BaseProvider {
    name = "ServiceTitan";
    type = "FIELD_SERVICE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_job",
                name: "Create Job",
                description: "Create a new job in ServiceTitan.",
                inputs: [
                    { id: "customerId", name: "Customer ID", type: "string", required: true },
                    { id: "jobTypeId", name: "Job Type ID", type: "string", required: true }
                ]
            }
        ];
    }
}
