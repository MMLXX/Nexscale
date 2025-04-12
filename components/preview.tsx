"use client"

import { useState } from "react"
import type { TypographySettings } from "@/components/typescale-calculator"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Info, Eye, PlusCircle, MinusCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PreviewProps {
  settings: TypographySettings
  scale: Record<string, number>
  fluidTypography: boolean
  setFluidTypography: (value: boolean) => void
  minViewport: number
  setMinViewport: (value: number) => void
  maxViewport: number
  setMaxViewport: (value: number) => void
  minFontSize: number
  setMinFontSize: (value: number) => void
  maxFontSize: number
  setMaxFontSize: (value: number) => void
  minScaleRatio: number
  setMinScaleRatio: (value: number) => void
  maxScaleRatio: number
  setMaxScaleRatio: (value: number) => void
  fluidMethod: "clamp" | "locks"
  setFluidMethod: (value: "clamp" | "locks") => void
  scaleShift: number
  setScaleShift: (value: number) => void
}

// Predefined scale ratios with names
const PREDEFINED_SCALES = [
  { name: "Minor Second (1.067)", value: 1.067, description: "Subtle, barely noticeable" },
  { name: "Major Second (1.125)", value: 1.125, description: "Musical and pleasant" },
  { name: "Minor Third (1.2)", value: 1.2, description: "Classic, very readable" },
  { name: "Major Third (1.25)", value: 1.25, description: "Comfortable for reading" },
  { name: "Perfect Fourth (1.333)", value: 1.333, description: "Widely used in web design" },
  { name: "Augmented Fourth (1.414)", value: 1.414, description: "Bold but still readable" },
  { name: "Perfect Fifth (1.5)", value: 1.5, description: "Dramatic, strong contrast" },
  { name: "Golden Ratio (1.618)", value: 1.618, description: "Natural, aesthetically pleasing" },
]

export function Preview({
  settings,
  scale,
  fluidTypography,
  setFluidTypography,
  minViewport,
  setMinViewport,
  maxViewport,
  setMaxViewport,
  minFontSize,
  setMinFontSize,
  maxFontSize,
  setMaxFontSize,
  minScaleRatio,
  setMinScaleRatio,
  maxScaleRatio,
  setMaxScaleRatio,
  fluidMethod,
  setFluidMethod,
  scaleShift,
  setScaleShift,
}: PreviewProps) {
  // Remove "em" from display units
  const [displayUnit, setDisplayUnit] = useState<"px" | "rem" | "pt">("px")
  const [previewViewport, setPreviewViewport] = useState(768) // Default preview at tablet size
  const [previewTab, setPreviewTab] = useState("static")
  // const [scaleShift, setScaleShift] = useState(0) // Positive values shift up, negative values shift down

  // Update the convertUnit function to remove "em" option
  const convertUnit = (pxValue: number): string => {
    switch (displayUnit) {
      case "rem":
        return `${(pxValue / 16).toFixed(2)}rem`
      case "pt":
        return `${(pxValue * 0.75).toFixed(2)}pt`
      default:
        return `${pxValue.toFixed(2)}px`
    }
  }

  // Calculate fluid scale based on current preview viewport
  const calculateFluidScale = (minSize: number, maxSize: number): number => {
    if (!fluidTypography) return minSize

    // Calculate the interpolated size based on viewport
    const viewportRatio = (previewViewport - minViewport) / (maxViewport - minViewport)
    const clampedRatio = Math.max(0, Math.min(1, viewportRatio)) // Ensure ratio is between 0 and 1
    return minSize + (maxSize - minSize) * clampedRatio
  }

  // Calculate fluid scale ratio
  const fluidRatio = calculateFluidScale(minScaleRatio, maxScaleRatio)

  // Calculate fluid base size
  const fluidBaseSize = calculateFluidScale(minFontSize, maxFontSize)

  // Completely new implementation of scale shifting
  const calculateAdjustedScale = (baseScale: Record<string, number>, shift: number): Record<string, number> => {
    // If no shift, return the original scale
    if (shift === 0) return { ...baseScale }

    // Create a new scale object
    const result = { ...baseScale }

    // Store the original values in an array for easier manipulation
    const originalHeadings = [
      baseScale.h1, // index 0
      baseScale.h2, // index 1
      baseScale.h3, // index 2
      baseScale.h4, // index 3
      baseScale.h5, // index 4
      baseScale.h6, // index 5
    ]

    // For positive shift (adding larger sizes)
    if (shift > 0) {
      // Apply the shift for each step
      for (let step = 0; step < shift; step++) {
        // Calculate a new larger size for h1
        const newH1 = Math.round(originalHeadings[0] * settings.scaleRatio * 100) / 100

        // Shift all headings down by one
        result.h6 = originalHeadings[4] // h5 becomes h6
        result.h5 = originalHeadings[3] // h4 becomes h5
        result.h4 = originalHeadings[2] // h3 becomes h4
        result.h3 = originalHeadings[1] // h2 becomes h3
        result.h2 = originalHeadings[0] // h1 becomes h2
        result.h1 = newH1 // New larger size for h1

        // Update the original headings for the next iteration
        originalHeadings[5] = originalHeadings[4]
        originalHeadings[4] = originalHeadings[3]
        originalHeadings[3] = originalHeadings[2]
        originalHeadings[2] = originalHeadings[1]
        originalHeadings[1] = originalHeadings[0]
        originalHeadings[0] = newH1
      }
    }
    // For negative shift (adding smaller sizes)
    else if (shift < 0) {
      const absShift = Math.abs(shift)

      // Apply the shift for each step
      for (let step = 0; step < absShift; step++) {
        // Calculate a new smaller size for h6
        const newH6 = Math.round((originalHeadings[5] / settings.scaleRatio) * 100) / 100

        // Shift all headings up by one
        result.h1 = originalHeadings[1] // h2 becomes h1
        result.h2 = originalHeadings[2] // h3 becomes h2
        result.h3 = originalHeadings[3] // h4 becomes h3
        result.h4 = originalHeadings[4] // h5 becomes h4
        result.h5 = originalHeadings[5] // h6 becomes h5
        result.h6 = newH6 // New smaller size for h6

        // Update the original headings for the next iteration
        originalHeadings[0] = originalHeadings[1]
        originalHeadings[1] = originalHeadings[2]
        originalHeadings[2] = originalHeadings[3]
        originalHeadings[3] = originalHeadings[4]
        originalHeadings[4] = originalHeadings[5]
        originalHeadings[5] = newH6
      }
    }

    return result
  }

  const baseFluidScale = {
    h1: Math.round(fluidBaseSize * Math.pow(fluidRatio, 5) * 100) / 100,
    h2: Math.round(fluidBaseSize * Math.pow(fluidRatio, 4) * 100) / 100,
    h3: Math.round(fluidBaseSize * Math.pow(fluidRatio, 3) * 100) / 100,
    h4: Math.round(fluidBaseSize * Math.pow(fluidRatio, 2) * 100) / 100,
    h5: Math.round(fluidBaseSize * Math.pow(fluidRatio, 1) * 100) / 100,
    h6: Math.round(fluidBaseSize * 100) / 100,
    p: fluidBaseSize,
    small: Math.round((fluidBaseSize / fluidRatio) * 100) / 100,
    smaller: Math.round((fluidBaseSize / (fluidRatio * fluidRatio)) * 100) / 100,
  }

  const fluidScale = calculateAdjustedScale(baseFluidScale, scaleShift)

  const baseMinScale = {
    h1: Math.round(minFontSize * Math.pow(minScaleRatio, 5) * 100) / 100,
    h2: Math.round(minFontSize * Math.pow(minScaleRatio, 4) * 100) / 100,
    h3: Math.round(minFontSize * Math.pow(minScaleRatio, 3) * 100) / 100,
    h4: Math.round(minFontSize * Math.pow(minScaleRatio, 2) * 100) / 100,
    h5: Math.round(minFontSize * Math.pow(minScaleRatio, 1) * 100) / 100,
    h6: Math.round(minFontSize * 100) / 100,
    p: minFontSize,
    small: Math.round((minFontSize / minScaleRatio) * 100) / 100,
    smaller: Math.round((minFontSize / (minScaleRatio * minScaleRatio)) * 100) / 100,
  }

  const baseMaxScale = {
    h1: Math.round(maxFontSize * Math.pow(maxScaleRatio, 5) * 100) / 100,
    h2: Math.round(maxFontSize * Math.pow(maxScaleRatio, 4) * 100) / 100,
    h3: Math.round(maxFontSize * Math.pow(maxScaleRatio, 3) * 100) / 100,
    h4: Math.round(maxFontSize * Math.pow(maxScaleRatio, 2) * 100) / 100,
    h5: Math.round(maxFontSize * Math.pow(maxScaleRatio, 1) * 100) / 100,
    h6: Math.round(maxFontSize * 100) / 100,
    p: maxFontSize,
    small: Math.round((maxFontSize / maxScaleRatio) * 100) / 100,
    smaller: Math.round((maxFontSize / (maxScaleRatio * maxScaleRatio)) * 100) / 100,
  }

  const minScale = calculateAdjustedScale(baseMinScale, scaleShift)
  const maxScale = calculateAdjustedScale(baseMaxScale, scaleShift)

  // Generate CSS clamp function for fluid typography
  const generateClamp = (minSize: number, maxSize: number): string => {
    // Calculate the slope and intercept for the linear equation
    const slope = (maxSize - minSize) / (maxViewport - minViewport)
    const intercept = minSize - slope * minViewport

    // Format the preferred value (linear equation based on viewport width)
    const preferredValue = `${slope * 100}vw + ${intercept}px`

    return `clamp(${minSize}px, ${preferredValue}, ${maxSize}px)`
  }

  // Generate CSS locks for fluid typography
  const generateCSSLock = (minSize: number, maxSize: number): string => {
    // Calculate the slope for the linear equation
    const slope = (maxSize - minSize) / (maxViewport - minViewport)

    // Format the CSS lock
    return `calc(${minSize}px + ${slope * 100}vw * (100vw - ${minViewport}px) / ${maxViewport - minViewport})`
  }

  // Generate fluid value based on selected method
  const generateFluidValue = (minSize: number, maxSize: number): string => {
    return fluidMethod === "clamp" ? generateClamp(minSize, maxSize) : generateCSSLock(minSize, maxSize)
  }

  const getHeadingStyle = (level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    // Use fluid scale if enabled, otherwise use static scale
    const fontSize = fluidTypography ? fluidScale[level] : scale[level]

    return {
      fontFamily: `"${settings.headings.family}", sans-serif`,
      fontSize: `${fontSize}px`, // Always use px for actual rendering
      fontWeight: settings.headings.weight,
      letterSpacing: settings.headings.letterSpacing,
      lineHeight: settings.headings.lineHeight,
      color: settings.headings.color,
      margin: "0.5em 0",
    }
  }

  const getBodyStyle = (size: "p" | "small" | "smaller") => {
    // Use fluid scale if enabled, otherwise use static scale
    const fontSize = fluidTypography ? fluidScale[size] : scale[size]

    return {
      fontFamily: `"${settings.body.family}", sans-serif`,
      fontSize: `${fontSize}px`, // Always use px for actual rendering
      fontWeight: settings.body.weight,
      letterSpacing: settings.body.letterSpacing,
      lineHeight: settings.body.lineHeight,
      color: settings.body.color,
      margin: "0.5em 0",
    }
  }

  // Generate CSS for fluid typography
  const generateFluidCSS = () => {
    return `:root {
  /* Base sizes - fluid typography using ${fluidMethod} */
  --font-size-base: ${generateFluidValue(minScale.p, maxScale.p)};
  --font-size-small: ${generateFluidValue(minScale.small, maxScale.small)};
  --font-size-smaller: ${generateFluidValue(minScale.smaller, maxScale.smaller)};

  /* Heading sizes - fluid typography using ${fluidMethod} */
  --font-size-h1: ${generateFluidValue(minScale.h1, maxScale.h1)};
  --font-size-h2: ${generateFluidValue(minScale.h2, maxScale.h2)};
  --font-size-h3: ${generateFluidValue(minScale.h3, maxScale.h3)};
  --font-size-h4: ${generateFluidValue(minScale.h4, maxScale.h4)};
  --font-size-h5: ${generateFluidValue(minScale.h5, maxScale.h5)};
  --font-size-h6: ${generateFluidValue(minScale.h6, maxScale.h6)};

  /* Font families */
  --font-family-headings: "${settings.headings.family}", sans-serif;
  --font-family-body: "${settings.body.family}", sans-serif;

  /* Font weights */
  --font-weight-headings: ${settings.headings.weight};
  --font-weight-body: ${settings.body.weight};

  /* Line heights */
  --line-height-headings: ${settings.headings.lineHeight};
  --line-height-body: ${settings.body.lineHeight};

  /* Letter spacing */
  --letter-spacing-headings: ${settings.headings.letterSpacing};
  --letter-spacing-body: ${settings.body.letterSpacing};

  /* Colors */
  --color-headings: ${settings.headings.color};
  --color-body: ${settings.body.color};
}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
          <Eye className="h-5 w-5 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center space-x-2">
            <Label htmlFor="displayUnit" className="text-sm font-medium">
              Display Unit:
            </Label>
            <Select value={displayUnit} onValueChange={(value) => setDisplayUnit(value as any)}>
              <SelectTrigger id="displayUnit" className="w-[80px] focus-visible:ring-primary">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">px</SelectItem>
                <SelectItem value="rem">rem</SelectItem>
                <SelectItem value="pt">pt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Separator className="bg-border/50" />

      {/* Fluid Typography Controls */}
      <div className="space-y-4 bg-muted/30 backdrop-blur-sm p-4 rounded-lg border border-border/50">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="fluid-typography"
              checked={fluidTypography}
              onCheckedChange={setFluidTypography}
              className="data-[state=checked]:bg-foreground"
            />
            <Label htmlFor="fluid-typography" className="font-medium">
              Fluid Typescale
            </Label>
          </div>
        </div>

        {fluidTypography && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50 border border-border/50">
              <Info className="h-4 w-4 text-foreground" />
              <span>Fluid typography scales smoothly between viewport sizes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="min-viewport" className="text-sm font-medium">
                  Min Viewport (px)
                </Label>
                <Input
                  id="min-viewport"
                  type="number"
                  value={minViewport}
                  onChange={(e) => setMinViewport(Number(e.target.value))}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="max-viewport" className="text-sm font-medium">
                  Max Viewport (px)
                </Label>
                <Input
                  id="max-viewport"
                  type="number"
                  value={maxViewport}
                  onChange={(e) => setMaxViewport(Number(e.target.value))}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="min-font-size" className="text-sm font-medium">
                  Min Font Size (px)
                </Label>
                <Input
                  id="min-font-size"
                  type="number"
                  value={minFontSize}
                  onChange={(e) => setMinFontSize(Number(e.target.value))}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="max-font-size" className="text-sm font-medium">
                  Max Font Size (px)
                </Label>
                <Input
                  id="max-font-size"
                  type="number"
                  value={maxFontSize}
                  onChange={(e) => setMaxFontSize(Number(e.target.value))}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="min-scale-ratio" className="text-sm font-medium">
                  Min Scale Ratio
                </Label>
                <Select value={minScaleRatio.toString()} onValueChange={(value) => setMinScaleRatio(Number(value))}>
                  <SelectTrigger id="min-scale-ratio" className="focus-visible:ring-primary">
                    <SelectValue placeholder="Select scale ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_SCALES.map((scale) => (
                      <SelectItem key={scale.value.toString()} value={scale.value.toString()}>
                        {scale.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="max-scale-ratio" className="text-sm font-medium">
                  Max Scale Ratio
                </Label>
                <Select value={maxScaleRatio.toString()} onValueChange={(value) => setMaxScaleRatio(Number(value))}>
                  <SelectTrigger id="max-scale-ratio" className="focus-visible:ring-primary">
                    <SelectValue placeholder="Select scale ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_SCALES.map((scale) => (
                      <SelectItem key={scale.value.toString()} value={scale.value.toString()}>
                        {scale.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fluid Method Selection */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Fluid Typography Method</Label>
              <RadioGroup
                value={fluidMethod}
                onValueChange={(value) => setFluidMethod(value as "clamp" | "locks")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="clamp"
                    id="clamp"
                    className="text-foreground border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                  />
                  <Label htmlFor="clamp">CSS Clamp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="locks"
                    id="locks"
                    className="text-foreground border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                  />
                  <Label htmlFor="locks">CSS Locks</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {fluidMethod === "clamp"
                  ? "CSS Clamp provides a concise way to set min, preferred, and max values in one declaration."
                  : "CSS Locks offer more precise control over the rate of scaling between viewport sizes."}
              </p>
            </div>

            {/* Viewport Size Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <Label htmlFor="preview-viewport" className="text-sm font-medium">
                  Preview Viewport Size: {previewViewport}px
                </Label>
                <span className="text-sm text-muted-foreground">
                  Base Size: {fluidBaseSize.toFixed(2)}px | Scale Ratio: {fluidRatio.toFixed(3)}
                </span>
              </div>
              <input
                id="preview-viewport"
                type="range"
                min={minViewport}
                max={maxViewport}
                value={previewViewport}
                onChange={(e) => setPreviewViewport(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mobile ({minViewport}px)</span>
                <span>Tablet (768px)</span>
                <span>Desktop ({maxViewport}px)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium">Typography Scale</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="max-w-sm">
              <p>
                Adjust the range of your typography scale by adding larger sizes (above h1) or smaller sizes (below h6).
                The scale will always maintain 6 heading levels.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="ml-auto text-sm text-muted-foreground">
          Scale Range: {scaleShift > 0 ? `+${scaleShift}` : scaleShift}
        </div>
      </div>

      <div className="space-y-6 py-2">
        <div className="flex items-center mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 mr-2 rounded-md border-border/50 bg-background/50"
                  onClick={() => setScaleShift((prev) => prev + 1)}
                >
                  <PlusCircle className="h-4 w-4 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add larger size (shift scale up)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex-1 text-xs text-muted-foreground">Add larger size</div>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;h1&gt;
            </code>
            <h1 style={getHeadingStyle("h1")}>Build hierarchies that guide the eye.</h1>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.h1, maxScale.h1)
                : convertUnit(fluidTypography ? fluidScale.h1 : scale.h1)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;h2&gt;
            </code>
            <h2 style={getHeadingStyle("h2")}>Build hierarchies that guide the eye.</h2>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.h2, maxScale.h2)
                : convertUnit(fluidTypography ? fluidScale.h2 : scale.h2)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;h3&gt;
            </code>
            <h3 style={getHeadingStyle("h3")}>Build hierarchies that guide the eye.</h3>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.h3, maxScale.h3)
                : convertUnit(fluidTypography ? fluidScale.h3 : scale.h3)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;h4&gt;
            </code>
            <h4 style={getHeadingStyle("h4")}>Build hierarchies that guide the eye.</h4>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.h4, maxScale.h4)
                : convertUnit(fluidTypography ? fluidScale.h4 : scale.h4)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;h5&gt;
            </code>
            <h5 style={getHeadingStyle("h5")}>Build hierarchies that guide the eye.</h5>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.h5, maxScale.h5)
                : convertUnit(fluidTypography ? fluidScale.h5 : scale.h5)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;h6&gt;
            </code>
            <h6 style={getHeadingStyle("h6")}>Build hierarchies that guide the eye.</h6>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.h6, maxScale.h6)
                : convertUnit(fluidTypography ? fluidScale.h6 : scale.h6)}
            </span>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 mr-2 rounded-md border-border/50 bg-background/50"
                  onClick={() => setScaleShift((prev) => prev - 1)}
                >
                  <MinusCircle className="h-4 w-4 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add smaller size (shift scale down)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex-1 text-xs text-muted-foreground">Add smaller size</div>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;p&gt;
            </code>
            <p style={getBodyStyle("p")}>Body text</p>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.p, maxScale.p)
                : convertUnit(fluidTypography ? fluidScale.p : scale.p)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              &lt;small&gt;
            </code>
            <small style={getBodyStyle("small")}>Small text</small>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.small, maxScale.small)
                : convertUnit(fluidTypography ? fluidScale.small : scale.small)}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm mr-2 font-mono border border-border/50">
              .smaller
            </code>
            <span style={getBodyStyle("smaller")}>Smaller text</span>
            <span className="ml-2 text-muted-foreground">
              {fluidTypography
                ? generateFluidValue(minScale.smaller, maxScale.smaller)
                : convertUnit(fluidTypography ? fluidScale.smaller : scale.smaller)}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <h3 style={getHeadingStyle("h3")}>Sample Text</h3>
          <p style={getBodyStyle("p")}>
            This is a paragraph of text. It should be easy to read and have good contrast. The line height should be
            comfortable for reading longer passages of text. The font family, weight, and other properties can be
            customized to match your design needs.
          </p>
          <p style={getBodyStyle("p")}>
            <strong style={{ fontWeight: "bold" }}>Bold text</strong> and{" "}
            <em style={{ fontStyle: "italic" }}>italic text</em> should also be legible and maintain the same level of
            readability.
          </p>
        </div>
      </div>
    </div>
  )
}
