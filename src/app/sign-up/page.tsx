import { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
    title: "Sign Up - WorkflowOS",
    description: "Create your account",
}

export default function SignupPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-600 to-orange-600 animate-gradient" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                    </svg>
                    WorkflowOS
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2 border-l-2 border-white/30 pl-6 backdrop-blur-sm p-4 rounded-r-xl bg-white/5">
                        <p className="text-lg leading-relaxed">
                            &ldquo;Joining WorkflowOS was the best decision for our team's productivity. Providing tools this powerful is a game changer.&rdquo;
                        </p>
                        <footer className="text-sm font-semibold tracking-wide opacity-80">Alex Chen, Product Lead</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 flex items-center justify-center h-full bg-background relative overflow-hidden">
                { /* Ambient background effect */}
                <div className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px] relative z-10 p-4">
                    <SignupForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
