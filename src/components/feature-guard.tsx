"use client"

import * as React from "react"
import { usePostHog } from "posthog-js/react"

interface FeatureGuardProps {
    feature: string
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function FeatureGuard({ feature, children, fallback = null }: FeatureGuardProps) {
    const posthog = usePostHog()
    const isEnabled = posthog?.isFeatureEnabled(feature)

    if (!isEnabled) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
