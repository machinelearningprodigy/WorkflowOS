'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signup, signInWithGoogle } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02]" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {pending ? 'Creating account...' : 'Create Account'}
        </Button>
    )
}

export function SignupForm() {
    const [state, formAction] = useFormState(signup, null)

    return (
        <Card className="w-full max-w-md border-0 shadow-2xl bg-background/60 backdrop-blur-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form action={formAction} className="grid gap-4">
                    {state?.error && (
                        <div className="text-sm font-medium text-destructive text-center p-2 bg-destructive/10 rounded-md">
                            {state.error}
                        </div>
                    )}
                    {state?.success && (
                        <div className="text-sm font-medium text-green-600 text-center p-2 bg-green-500/10 rounded-md">
                            {state.message}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First name</Label>
                            <Input id="first_name" name="first_name" placeholder="John" required className="bg-background/50" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last name</Label>
                            <Input id="last_name" name="last_name" placeholder="Doe" required className="bg-background/50" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-background/50" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required className="bg-background/50" />
                        <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary transition-colors">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
