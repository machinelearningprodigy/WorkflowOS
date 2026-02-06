"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to detect if a media query matches.
 * Useful for responsive design in JavaScript (e.g., dynamic component rendering).
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        const listener = () => setMatches(media.matches)
        media.addEventListener("change", listener)

        return () => media.removeEventListener("change", listener)
    }, [matches, query])

    return matches
}

// Common breakpoints
export const useIsMobile = () => useMediaQuery("(max-width: 768px)")
export const useIsTablet = () => useMediaQuery("(max-width: 1024px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)")
