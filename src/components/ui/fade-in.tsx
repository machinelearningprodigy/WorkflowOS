"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

export function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    )
}
