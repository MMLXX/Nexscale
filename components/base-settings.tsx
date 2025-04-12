"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TypographySettings } from "@/components/typescale-calculator"
import { Separator } from "@/components/ui/separator"
import { Sliders } from "lucide-react"

interface BaseSettingsProps {
  settings: TypographySettings
  updateSettings: (settings: Partial<TypographySettings>) => void
}

const PREDEFINED_SCALES = [
  { name: "Minor Second (1.067)", value: 1.067, description: "Subtle, barely noticeable" },
  { name: "Major Second (1.125)", value: 1.125, description: "Musical and pleasant" },
  { name: "Minor Third (1.2)", value: 1.2, description: "Classic, very readable" },
  { name: "Major Third (1.25)", value: 1.25, description: "Comfortable for reading" },
  { name: "Perfect Fourth (1.333)", value: 1.333, description: "Widely used in web design" },
  { name: "Augmented Fourth (1.414)", value: 1.414, description: "Bold but still readable" },
  { name: "Perfect Fifth (1.5)", value: 1.5, description: "Dramatic, strong contrast" },
  { name: "Golden Ratio (1.618)", value: 1.618, description: "Natural, aesthetically pleasing" },
  { name: "Custom", value: "custom", description: "Enter your own ratio" },
]

// Update the BaseSettings component to only show px for input
export function BaseSettings({ settings, updateSettings }: BaseSettingsProps) {
  const handleScaleChange = (value: string) => {
    if (value === "custom") {
      // Keep the current value if switching to custom
      return
    }

    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      updateSettings({ scaleRatio: numValue })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
          <Sliders className="h-5 w-5 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Base Settings</h2>
      </div>
      <Separator className="bg-border/50" />

      <div className="space-y-5">
        <div className="space-y-2.5">
          <Label htmlFor="baseSize" className="text-sm font-medium">
            Base Size (px)
          </Label>
          <Input
            id="baseSize"
            type="number"
            value={settings.baseSize}
            onChange={(e) => updateSettings({ baseSize: Number.parseFloat(e.target.value) || 16 })}
            className="focus-visible:ring-primary"
          />
          <p className="text-xs text-muted-foreground">Base font size is always in pixels</p>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="scaleRatio" className="text-sm font-medium">
            Scale Ratio
          </Label>
          <Select
            value={
              PREDEFINED_SCALES.find((scale) => scale.value === settings.scaleRatio)
                ? settings.scaleRatio.toString()
                : "custom"
            }
            onValueChange={handleScaleChange}
          >
            <SelectTrigger id="scaleRatio" className="focus-visible:ring-primary">
              <SelectValue placeholder="Select scale ratio" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_SCALES.map((scale) => (
                <SelectItem
                  key={typeof scale.value === "string" ? scale.value : scale.value.toString()}
                  value={typeof scale.value === "string" ? scale.value : scale.value.toString()}
                >
                  {scale.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {PREDEFINED_SCALES.find(
              (scale) =>
                scale.value === settings.scaleRatio ||
                (scale.value === "custom" && !PREDEFINED_SCALES.some((s) => s.value === settings.scaleRatio)),
            )?.description || "Choose a ratio for your type scale"}
          </p>
        </div>

        {!PREDEFINED_SCALES.some((scale) => scale.value === settings.scaleRatio) && (
          <div className="space-y-2.5">
            <Label htmlFor="customScale" className="text-sm font-medium">
              Custom Scale Ratio
            </Label>
            <Input
              id="customScale"
              type="number"
              step="0.001"
              value={settings.scaleRatio}
              onChange={(e) => updateSettings({ scaleRatio: Number.parseFloat(e.target.value) || 1.25 })}
              className="focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter a value between 1.0 and 2.0 for best results</p>
          </div>
        )}
      </div>
    </div>
  )
}
