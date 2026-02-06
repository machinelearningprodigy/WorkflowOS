import { BaseProvider, Action, Trigger } from "../base.provider";

export class DropboxProvider extends BaseProvider {
    name = "Dropbox";
    type = "STORAGE";

    getAvailableActions(): Action[] {
        return [
            {
                id: "upload_file",
                name: "Upload File",
                description: "Upload a file to Dropbox.",
                inputs: [
                    { id: "path", name: "File Path", type: "string", required: true },
                    { id: "content", name: "Content", type: "string", required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: "file_changed",
                name: "File Changed",
                description: "Triggers when a file is added or updated.",
                type: "webhook"
            }
        ];
    }
}
