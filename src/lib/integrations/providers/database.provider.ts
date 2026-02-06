import { BaseProvider, Action, Trigger } from "../base.provider";

export class DatabaseProvider extends BaseProvider {
    name = "Direct Database";
    type = "DATABASE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "execute_query",
                name: "Execute SQL Query",
                description: "Run a raw SQL query on the connected database.",
                inputs: [
                    { id: "query", name: "SQL Query", type: "string", required: true },
                    { id: "params", name: "Parameters (JSON array string)", type: "string", required: false }
                ]
            }
        ];
    }
}
