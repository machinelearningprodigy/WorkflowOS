"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface FormFieldProps {
    label: string
    type: "string" | "number" | "boolean" | "select" | "textarea"
    placeholder?: string
    description?: string
    required?: boolean
    options?: { label: string; value: string }[]
    value: any
    onChange: (value: any) => void
}

export function FormField({
    label,
    type,
    placeholder,
    description,
    required,
    options,
    value,
    onChange
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            </div>

            {type === "textarea" ? (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[100px] border-slate-200"
                />
            ) : type === "select" ? (
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="border-slate-200">
                        <SelectValue placeholder={placeholder || "Select option..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : type === "boolean" ? (
                <div className="flex items-center space-x-2 pt-1">
                    <Switch checked={value} onCheckedChange={onChange} />
                </div>
            ) : (
                <Input
                    type={type === "number" ? "number" : "text"}
                    value={value}
                    onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
                    placeholder={placeholder}
                    className="h-10 border-slate-200"
                />
            )}

            {description && (
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
            )}
        </div>
    )
}
