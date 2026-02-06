"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "./form-field"
import { DynamicField } from "./dynamic-field"
import { ResourcePicker } from "./resource-picker"
import { CredentialSelect } from "./credential-select"
import { FieldMapper } from "./field-mapper"

interface StepConfig {
    id: string
    name: string
    inputs: any[]
}

export function FormBuilder({ config, data, onDataChange }: { config: StepConfig, data: any, onDataChange: (d: any) => void }) {
    const handleChange = (id: string, value: any) => {
        onDataChange({ ...data, [id]: value })
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {config.inputs.map((input) => (
                    <div key={input.id}>
                        {input.type === 'resource' ? (
                            <ResourcePicker
                                label={input.name}
                                value={data[input.id]}
                                onSelect={(id, name) => handleChange(input.id, name)}
                                provider={input.provider}
                            />
                        ) : input.type === 'mapper' ? (
                            <FieldMapper
                                mappings={data[input.id] || []}
                                onChange={(val) => handleChange(input.id, val)}
                                sourceFields={[]}
                            />
                        ) : input.type === 'dynamic' ? (
                            <DynamicField
                                label={input.name}
                                value={data[input.id] || ""}
                                onChange={(val) => handleChange(input.id, val)}
                                placeholder={input.placeholder}
                            />
                        ) : (
                            <FormField
                                label={input.name}
                                type={input.type}
                                value={data[input.id]}
                                onChange={(val) => handleChange(input.id, val)}
                                description={input.description}
                                required={input.required}
                                options={input.options}
                                placeholder={input.placeholder}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
