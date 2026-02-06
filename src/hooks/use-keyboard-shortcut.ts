"use client"

import { useEffect } from "react"

/**
 * Custom hook to listen for keyboard shortcuts.
 */
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    metaKey: boolean = true,
    ctrlKey: boolean = false
) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isKeyMatch = event.key.toLowerCase() === key.toLowerCase()
            const isMetaMatch = !metaKey || event.metaKey
            const isCtrlMatch = !ctrlKey || event.ctrlKey

            if (isKeyMatch && isMetaMatch && isCtrlMatch) {
                event.preventDefault()
                callback()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [key, callback, metaKey, ctrlKey])
}
