import { BaseProvider, Action, Trigger } from "../base.provider";

export class AirtableProvider extends BaseProvider {
    name = "Airtable";
    type = "DATABASE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "create_record",
                name: "Create Record",
                description: "Creates a new record in a specific table.",
                inputs: [
                    { id: "base_id", name: "Base ID", type: "string", required: true },
                    { id: "table_name", name: "Table Name", type: "string", required: true },
                    { id: "fields", name: "Fields (JSON string)", type: "string", required: true }
                ]
            },
            {
                id: "update_record",
                name: "Update Record",
                description: "Updates an existing record by ID.",
                inputs: [
                    { id: "base_id", name: "Base ID", type: "string", required: true },
                    { id: "table_name", name: "Table Name", type: "string", required: true },
                    { id: "record_id", name: "Record ID", type: "string", required: true },
                    { id: "fields", name: "Fields (JSON string)", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "new_record",
                name: "New Record",
                description: "Triggers when a new record is added.",
                type: "webhook"
            }
        ];
    }

    async testConnection(accessToken: string): Promise<boolean> {
        return !!accessToken;
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        console.log(`Executing Airtable action: ${action}`, config, accessToken);
        return { success: true, id: "rec_" + Math.random().toString(36).substr(2, 9) };
    }
}
