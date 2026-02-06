"use client"

import { useState, useCallback } from "react"
import { useToast } from "./use-toast"
import { apiClient } from "@/utils/api-client"
import { Workflow } from "@/types/workflow.types"

/**
 * Custom hook for managing workflow CRUD operations.
 */
export function useWorkflows() {
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { addToast } = useToast()

    const fetchWorkflows = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await apiClient.get<Workflow[]>("/dashboard/workflows")
            setWorkflows(data)
        } catch (error) {
            addToast({
                title: "Failed to load workflows",
                description: "Please check your connection and try again.",
                type: "error"
            })
        } finally {
            setIsLoading(false)
        }
    }, [addToast])

    const createWorkflow = async (name: string, description?: string) => {
        try {
            const newWorkflow = await apiClient.post<Workflow>("/dashboard/workflows", { name, description })
            setWorkflows(prev => [newWorkflow, ...prev])
            addToast({
                title: "Workflow created",
                description: `Successfully created "${name}".`,
                type: "success"
            })
            return newWorkflow
        } catch (error) {
            addToast({
                title: "Creation failed",
                description: "Could not create the workflow at this time.",
                type: "error"
            })
            return null
        }
    }

    const deleteWorkflow = async (id: string) => {
        try {
            await apiClient.delete(`/dashboard/workflows/${id}`)
            setWorkflows(prev => prev.filter(w => w.id !== id))
            addToast({
                title: "Workflow deleted",
                type: "success"
            })
            return true
        } catch (error) {
            addToast({
                title: "Deletion failed",
                type: "error"
            })
            return false
        }
    }

    return {
        workflows,
        isLoading,
        fetchWorkflows,
        createWorkflow,
        deleteWorkflow
    }
}
