"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

/**
 * Custom hook for interacting with the clipboard.
 * Provides a copy function and a copied state.
 */
export function useClipboard() {
    const [isCopied, setIsCopied] = useState(false)
    const { addToast } = useToast()

    const copy = async (text: string, label: string = "Text") => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
            addToast({
                title: "Copied to clipboard",
                description: `${label} has been copied successfully.`,
                type: "success"
            })
            setTimeout(() => setIsCopied(false), 2000)
            return true
        } catch (error) {
            console.error("Failed to copy text: ", error)
            addToast({
                title: "Copy failed",
                description: `Could not copy ${label.toLowerCase()} to clipboard.`,
                type: "error"
            })
            return false
        }
    }

    return { copy, isCopied }
}
