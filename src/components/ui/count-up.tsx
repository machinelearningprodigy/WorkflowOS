"use client"

import * as React from "react"
import { animate } from "framer-motion"

export function CountUp({
    value,
    duration = 2,
    className
}: {
    value: number
    duration?: number
    className?: string
}) {
    const [displayValue, setDisplayValue] = React.useState(0)

    React.useEffect(() => {
        const controls = animate(0, value, {
            duration: duration,
            ease: "easeOut",
            onUpdate(value) {
                setDisplayValue(Math.floor(value))
            },
        })
        return () => controls.stop()
    }, [value, duration])

    return (
        <span className={className}>
            {displayValue.toLocaleString()}
        </span>
    )
}
