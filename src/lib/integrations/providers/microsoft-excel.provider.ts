import { BaseProvider, Action, Trigger } from "../base.provider";

export class MicrosoftExcelProvider extends BaseProvider {
    name = "Microsoft Excel";
    type = "SPREADSHEET";

    getAvailableActions(): Action[] {
        return [
            {
                id: "add_row",
                name: "Add Row",
                description: "Append a row to an Excel worksheet.",
                inputs: [
                    { id: "workbookId", name: "Workbook ID", type: "string", required: true },
                    { id: "worksheet", name: "Worksheet Name", type: "string", required: true },
                    { id: "values", name: "Values (JSON array)", type: "string", required: true }
                ]
            }
        ];
    }
}
