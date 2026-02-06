import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WorkflowOS - The Operating System for Modern Work",
    description: "Streamline your workflows, automate tasks, and boost productivity with WorkflowOS.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
