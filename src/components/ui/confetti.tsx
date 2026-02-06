"use client"

import * as React from "react"
import canvasConfetti from "canvas-confetti"

export function useConfetti() {
    const trigger = React.useCallback((options?: canvasConfetti.Options) => {
        canvasConfetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
            ...options
        })
    }, [])

    return { trigger }
}

export function Confetti({ active }: { active?: boolean }) {
    const { trigger } = useConfetti()

    React.useEffect(() => {
        if (active) {
            trigger()
        }
    }, [active, trigger])

    return null
}
