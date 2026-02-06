"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { TRPCProvider } from "@/utils/trpc"
import { AnalyticsProvider } from "./analytics-provider"
import { ToastProviderWrapper } from "./toast-provider"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TRPCProvider>
            <AnalyticsProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ToastProviderWrapper>
                        {children}
                    </ToastProviderWrapper>
                </ThemeProvider>
            </AnalyticsProvider>
        </TRPCProvider>
    )
}
