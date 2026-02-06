import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted/20 border-t py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 font-bold text-xl">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                                W
                            </div>
                            <span>WorkflowOS</span>
                        </div>
                        <p className="text-muted-foreground">
                            The operating system for modern work. Automate, organize, and easy-orchestrate your business.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Integrations</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">API Reference</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Community</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} WorkflowOS. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
