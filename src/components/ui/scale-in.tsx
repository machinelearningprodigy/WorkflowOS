"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

export function ScaleIn({
    children,
    delay = 0,
    duration = 0.4,
    ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration, delay, ease: [0.34, 1.56, 0.64, 1] }} // Springy ease
            {...props}
        >
            {children}
        </motion.div>
    )
}
