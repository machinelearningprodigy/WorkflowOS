"use client"

import { create } from 'zustand'

export type ModalType =
    | "create-workflow"
    | "delete-workflow"
    | "invite-team"
    | "connect-integration"
    | "upgrade-plan"
    | "create-api-key"

interface ModalData {
    workflowName?: string
    integration?: {
        name: string
        icon: string
        provider: string
    }
}

interface ModalStore {
    type: ModalType | null
    data: ModalData
    isOpen: boolean
    onOpen: (type: ModalType, data?: ModalData) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false, data: {} })
}))
