"use client"

import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TemplateCard({
    template,
    onUse,
}: {
    template: {
        id: string
        name: string
        description: string
        category: string
        popularity: number
    }
    onUse: (id: string) => void
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className="flex h-full flex-col border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                            {template.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-medium font-mono">
                            <Star className="h-3 w-3 fill-current" />
                            {template.popularity / 100}k
                        </div>
                    </div>
                    <CardTitle className="text-lg leading-tight mb-2 uppercase tracking-wide">
                        {template.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                        {template.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                    <Button onClick={() => onUse(template.id)} className="w-full gap-2 group">
                        Use Template
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
