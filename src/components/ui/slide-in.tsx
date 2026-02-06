"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

export function SlideIn({
    children,
    direction = "up",
    delay = 0,
    duration = 0.5,
    ...props
}: HTMLMotionProps<"div"> & {
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number
}) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    )
}
