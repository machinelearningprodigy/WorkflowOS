"use client"

import { useModal } from "@/hooks/use-modal"
import { CreateWorkflowModal } from "./create-workflow-modal"
import { DeleteWorkflowModal } from "./delete-workflow-modal"
import { InviteTeamModal } from "./invite-team-modal"
import { ConnectIntegrationModal } from "./connect-integration-modal"
import { UpgradeModal } from "../billing/upgrade-modal"

export function ModalManager() {
    const { type, isOpen, data, onClose } = useModal()

    return (
        <>
            <CreateWorkflowModal
                isOpen={isOpen && type === "create-workflow"}
                onOpenChange={(open) => !open && onClose()}
            />
            <DeleteWorkflowModal
                isOpen={isOpen && type === "delete-workflow"}
                onOpenChange={(open) => !open && onClose()}
                workflowName={data?.workflowName || ""}
                onConfirm={() => {
                    console.log("Deleted")
                    onClose()
                }}
            />
            <InviteTeamModal
                isOpen={isOpen && type === "invite-team"}
                onOpenChange={(open) => !open && onClose()}
            />
            {data?.integration && (
                <ConnectIntegrationModal
                    isOpen={isOpen && type === "connect-integration"}
                    onOpenChange={(open) => !open && onClose()}
                    integration={data.integration}
                />
            )}
            <UpgradeModal
                isOpen={isOpen && type === "upgrade-plan"}
                onClose={onClose}
            />
        </>
    )
}
