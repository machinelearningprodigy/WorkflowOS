"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function PerformanceMonitor() {
    const pathname = usePathname()

    useEffect(() => {
        // Basic performance reporting logic
        if (typeof window !== "undefined" && "performance" in window) {
            const paint = performance.getEntriesByType("paint")
            paint.forEach((entry) => {
                if (entry.name === "first-contentful-paint") {
                    console.log(`[Performance] FCP for ${pathname}: ${entry.startTime.toFixed(2)}ms`)
                }
            })
        }
    }, [pathname])

    return null
}
