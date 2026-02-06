"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Stepper({
    steps,
    currentStep,
    className,
}: {
    steps: string[]
    currentStep: number
    className?: string
}) {
    return (
        <div className={cn("flex w-full items-center", className)}>
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                                index < currentStep
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : index === currentStep
                                        ? "border-primary text-primary"
                                        : "border-muted text-muted-foreground"
                            )}
                        >
                            {index < currentStep ? (
                                <Check className="h-6 w-6" />
                            ) : (
                                <span className="text-sm font-semibold">{index + 1}</span>
                            )}
                        </div>
                        <span
                            className={cn(
                                "mt-2 text-xs font-medium",
                                index === currentStep ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {step}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                "h-px flex-1 mx-4 mb-6",
                                index < currentStep ? "bg-primary" : "bg-muted"
                            )}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
