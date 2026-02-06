import { Toaster } from "@/components/ui/toaster"

export function ToastProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster />
        </>
    )
}
