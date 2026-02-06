import { BaseProvider, Action, Trigger } from "../base.provider";

export class OneDriveProvider extends BaseProvider {
    name = "OneDrive";
    type = "STORAGE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "download_file",
                name: "Download File",
                description: "Get the content of a file from OneDrive.",
                inputs: [
                    { id: "fileId", name: "File ID", type: "string", required: true }
                ]
            }
        ];
    }
}
