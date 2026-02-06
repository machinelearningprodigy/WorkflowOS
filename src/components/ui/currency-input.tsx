import { Input } from "@/components/ui/input"
import * as React from "react"

const CurrencyInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
                type="number"
                className="pl-7"
                ref={ref}
                {...props}
            />
        </div>
    )
})
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
