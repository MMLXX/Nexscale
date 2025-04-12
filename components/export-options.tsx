"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TypographySettings } from "@/components/typescale-calculator"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, Check, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Update the ExportOptionsProps interface to include scaleShift
interface ExportOptionsProps {
  settings: TypographySettings
  scale: Record<string, number>
  fluidTypography: boolean
  minViewport: number
  maxViewport: number
  minFontSize: number
  maxFontSize: number
  minScaleRatio: number
  maxScaleRatio: number
  fluidMethod: "clamp" | "locks"
  scaleShift: number
}

// Update the function parameters to include scaleShift
export function ExportOptions({
  settings,
  scale,
  fluidTypography,
  minViewport,
  maxViewport,
  minFontSize,
  maxFontSize,
  minScaleRatio,
  maxScaleRatio,
  fluidMethod,
  scaleShift,
}: ExportOptionsProps) {
  const [activeTab, setActiveTab] = useState("css")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Calculate min and max scales
  const minScale = {
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

  const maxScale = {
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

  // Update the generateCSSVariables function to include fluid typography option
  const generateCSSVariables = () => {
    if (fluidTypography) {
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
}

/* Base typography styles */
body {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
  color: var(--color-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-headings);
  line-height: var(--line-height-headings);
  letter-spacing: var(--letter-spacing-headings);
  color: var(--color-headings);
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }
h5 { font-size: var(--font-size-h5); }
h6 { font-size: var(--font-size-h6); }

small { font-size: var(--font-size-small); }
.smaller { font-size: var(--font-size-smaller); }`
    } else {
      return `:root {
  /* Base sizes */
  --font-size-base: ${settings.baseSize}px;
  --font-size-small: ${scale.small}px;
  --font-size-smaller: ${scale.smaller}px;

  /* Heading sizes */
  --font-size-h1: ${scale.h1}px;
  --font-size-h2: ${scale.h2}px;
  --font-size-h3: ${scale.h3}px;
  --font-size-h4: ${scale.h4}px;
  --font-size-h5: ${scale.h5}px;
  --font-size-h6: ${scale.h6}px;

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
}

/* Base typography styles */
body {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
  color: var(--color-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-headings);
  line-height: var(--line-height-headings);
  letter-spacing: var(--letter-spacing-headings);
  color: var(--color-headings);
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }
h5 { font-size: var(--font-size-h5); }
h6 { font-size: var(--font-size-h6); }

small { font-size: var(--font-size-small); }
.smaller { font-size: var(--font-size-smaller); }`
    }
  }

  // Update the generateSCSS function to include fluid typography option
  const generateSCSS = () => {
    if (fluidTypography) {
      return `// Typography Scale Variables
$min-viewport: ${minViewport}px;
$max-viewport: ${maxViewport}px;
$min-font-size: ${minFontSize}px;
$max-font-size: ${maxFontSize}px;
$min-scale-ratio: ${minScaleRatio};
$max-scale-ratio: ${maxScaleRatio};

// Font families
$font-family-headings: "${settings.headings.family}", sans-serif;
$font-family-body: "${settings.body.family}", sans-serif;

// Font weights
$font-weight-headings: ${settings.headings.weight};
$font-weight-body: ${settings.body.weight};

// Line heights
$line-height-headings: ${settings.headings.lineHeight};
$line-height-body: ${settings.body.lineHeight};

// Letter spacing
$letter-spacing-headings: ${settings.headings.letterSpacing};
$letter-spacing-body: ${settings.body.letterSpacing};

// Colors
$color-headings: ${settings.headings.color};
$color-body: ${settings.body.color};

// Fluid typography mixin
@function fluid-type($min-size, $max-size) {
  $slope: ($max-size - $min-size) / ($max-viewport - $min-viewport);
  $intercept: $min-size - $slope * $min-viewport;
  
  @return calc(#{$min-size}px + #{$slope * 100}vw);
}

// Calculate min and max scales
$min-scale-h1: $min-font-size * pow($min-scale-ratio, 5);
$min-scale-h2: $min-font-size * pow($min-scale-ratio, 4);
$min-scale-h3: $min-font-size * pow($min-scale-ratio, 3);
$min-scale-h4: $min-font-size * pow($min-scale-ratio, 2);
$min-scale-h5: $min-font-size * pow($min-scale-ratio, 1);
$min-scale-h6: $min-font-size;
$min-scale-small: $min-font-size / $min-scale-ratio;
$min-scale-smaller: $min-font-size / ($min-scale-ratio * $min-scale-ratio);

$max-scale-h1: $max-font-size * pow($max-scale-ratio, 5);
$max-scale-h2: $max-font-size * pow($max-scale-ratio, 4);
$max-scale-h3: $max-font-size * pow($max-scale-ratio, 3);
$max-scale-h4: $max-font-size * pow($max-scale-ratio, 2);
$max-scale-h5: $max-font-size * pow($max-scale-ratio, 1);
$max-scale-h6: $max-font-size;
$max-scale-small: $max-font-size / $max-scale-ratio;
$max-scale-smaller: $max-font-size / ($max-scale-ratio * $max-scale-ratio);

// Type scale variables
:root {
  --font-size-base: ${fluidMethod === "clamp" ? "clamp(#{$min-font-size}px, #{fluid-type($min-font-size, $max-font-size)}, #{$max-font-size}px)" : "calc(#{$min-font-size}px + #{($max-font-size - $min-font-size) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-h1: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-h1}px, #{fluid-type($min-scale-h1, $max-scale-h1)}, #{$max-scale-h1}px)" : "calc(#{$min-scale-h1}px + #{($max-scale-h1 - $min-scale-h1) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-h2: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-h2}px, #{fluid-type($min-scale-h2, $max-scale-h2)}, #{$max-scale-h2}px)" : "calc(#{$min-scale-h2}px + #{($max-scale-h2 - $min-scale-h2) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-h3: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-h3}px, #{fluid-type($min-scale-h3, $max-scale-h3)}, #{$max-scale-h3}px)" : "calc(#{$min-scale-h3}px + #{($max-scale-h3 - $min-scale-h3) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-h4: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-h4}px, #{fluid-type($min-scale-h4, $max-scale-h4)}, #{$max-scale-h4}px)" : "calc(#{$min-scale-h4}px + #{($max-scale-h4 - $min-scale-h4) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-h5: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-h5}px, #{fluid-type($min-scale-h5, $max-scale-h5)}, #{$max-scale-h5}px)" : "calc(#{$min-scale-h5}px + #{($max-scale-h5 - $min-scale-h5) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-h6: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-h6}px, #{fluid-type($min-scale-h6, $max-scale-h6)}, #{$max-scale-h6}px)" : "calc(#{$min-scale-h6}px + #{($max-scale-h6 - $min-scale-h6) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-small: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-small}px, #{fluid-type($min-scale-small, $max-scale-small)}, #{$max-scale-small}px)" : "calc(#{$min-scale-small}px + #{($max-scale-small - $min-scale-small) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};
  --font-size-smaller: ${fluidMethod === "clamp" ? "clamp(#{$min-scale-smaller}px, #{fluid-type($min-scale-smaller, $max-scale-smaller)}, #{$max-scale-smaller}px)" : "calc(#{$min-scale-smaller}px + #{($max-scale-smaller - $min-scale-smaller) * 100}vw * (100vw - #{$min-viewport}px) / #{$max-viewport - $min-viewport})"};

  --font-family-headings: #{$font-family-headings};
  --font-family-body: #{$font-family-body};
  --font-weight-headings: #{$font-weight-headings};
  --font-weight-body: #{$font-weight-body};
  --line-height-headings: #{$line-height-headings};
  --line-height-body: #{$line-height-body};
  --letter-spacing-headings: #{$letter-spacing-headings};
  --letter-spacing-body: #{$letter-spacing-body};
  --color-headings: #{$color-headings};
  --color-body: #{$color-body};
}

// Base typography styles
body {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
  color: var(--color-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-headings);
  line-height: var(--line-height-headings);
  letter-spacing: var(--letter-spacing-headings);
  color: var(--color-headings);
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }
h5 { font-size: var(--font-size-h5); }
h6 { font-size: var(--font-size-h6); }

small { font-size: var(--font-size-small); }
.smaller { font-size: var(--font-size-smaller); }`
    } else {
      return `// Typography Scale Variables
$font-size-base: ${settings.baseSize}px;
$font-size-ratio: ${settings.scaleRatio};

// Font families
$font-family-headings: "${settings.headings.family}", sans-serif;
$font-family-body: "${settings.body.family}", sans-serif;

// Font weights
$font-weight-headings: ${settings.headings.weight};
$font-weight-body: ${settings.body.weight};

// Line heights
$line-height-headings: ${settings.headings.lineHeight};
$line-height-body: ${settings.body.lineHeight};

// Letter spacing
$letter-spacing-headings: ${settings.headings.letterSpacing};
$letter-spacing-body: ${settings.body.letterSpacing};

// Colors
$color-headings: ${settings.headings.color};
$color-body: ${settings.body.color};

// Type scale function
@function type-scale($level) {
  @return $font-size-base * pow($font-size-ratio, $level);
}

// Type scale variables
:root {
  --font-size-smaller: #{type-scale(-2)};
  --font-size-small: #{type-scale(-1)};
  --font-size-base: #{$font-size-base};
  --font-size-h6: #{type-scale(0)};
  --font-size-h5: #{type-scale(1)};
  --font-size-h4: #{type-scale(2)};
  --font-size-h3: #{type-scale(3)};
  --font-size-h2: #{type-scale(4)};
  --font-size-h1: #{type-scale(5)};

  --font-family-headings: #{$font-family-headings};
  --font-family-body: #{$font-family-body};
  --font-weight-headings: #{$font-weight-headings};
  --font-weight-body: #{$font-weight-body};
  --line-height-headings: #{$line-height-headings};
  --line-height-body: #{$line-height-body};
  --letter-spacing-headings: #{$letter-spacing-headings};
  --letter-spacing-body: #{$letter-spacing-body};
  --color-headings: #{$color-headings};
  --color-body: #{$color-body};
}

// Base typography styles
body {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
  color: var(--color-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-headings);
  line-height: var(--line-height-headings);
  letter-spacing: var(--letter-spacing-headings);
  color: var(--color-headings);
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }
h5 { font-size: var(--font-size-h5); }
h6 { font-size: var(--font-size-h6); }

small { font-size: var(--font-size-small); }
.smaller { font-size: var(--font-size-smaller); }`
    }
  }

  const generateJSON = () => {
    if (fluidTypography) {
      return JSON.stringify(
        {
          settings: {
            base: {
              minViewport: minViewport,
              maxViewport: maxViewport,
              minFontSize: minFontSize,
              maxFontSize: maxFontSize,
              minScaleRatio: minScaleRatio,
              maxScaleRatio: maxScaleRatio,
              unit: settings.unit,
              fluidMethod: fluidMethod,
            },
            fonts: {
              headings: {
                family: settings.headings.family,
                weight: settings.headings.weight,
                lineHeight: settings.headings.lineHeight,
                letterSpacing: settings.headings.letterSpacing,
                color: settings.headings.color,
              },
              body: {
                family: settings.body.family,
                weight: settings.body.weight,
                lineHeight: settings.body.lineHeight,
                letterSpacing: settings.body.letterSpacing,
                color: settings.body.color,
              },
            },
          },
          minScale: minScale,
          maxScale: maxScale,
        },
        null,
        2,
      )
    } else {
      return JSON.stringify(
        {
          settings: {
            base: {
              size: settings.baseSize,
              unit: settings.unit,
              scaleRatio: settings.scaleRatio,
            },
            fonts: {
              headings: {
                family: settings.headings.family,
                weight: settings.headings.weight,
                lineHeight: settings.headings.lineHeight,
                letterSpacing: settings.headings.letterSpacing,
                color: settings.headings.color,
              },
              body: {
                family: settings.body.family,
                weight: settings.body.weight,
                lineHeight: settings.body.lineHeight,
                letterSpacing: settings.body.letterSpacing,
                color: settings.body.color,
              },
            },
          },
          scale: {
            h1: scale.h1,
            h2: scale.h2,
            h3: scale.h3,
            h4: scale.h4,
            h5: scale.h5,
            h6: scale.h6,
            p: scale.p,
            small: scale.small,
            smaller: scale.smaller,
          },
        },
        null,
        2,
      )
    }
  }

  const getExportContent = () => {
    switch (activeTab) {
      case "css":
        return generateCSSVariables()
      case "scss":
        return generateSCSS()
      case "json":
        return generateJSON()
      default:
        return ""
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent())
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: `${activeTab.toUpperCase()} content has been copied to your clipboard.`,
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleDownload = () => {
    const content = getExportContent()
    const fileExtension = activeTab === "json" ? "json" : activeTab
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `typography-scale.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "File downloaded",
      description: `typography-scale.${fileExtension} has been downloaded.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
          <Code className="h-5 w-5 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Export</h2>
      </div>
      <Separator className="bg-border/50" />

      <div className="flex items-center space-x-2 mb-4 p-3 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/50">
        <Switch
          id="fluid-typography-export"
          checked={fluidTypography}
          disabled={true}
          className="data-[state=checked]:bg-foreground"
        />
        <Label htmlFor="fluid-typography-export">
          {fluidTypography ? "Fluid Typography Enabled" : "Fluid Typography Disabled"}
        </Label>
        {fluidTypography && (
          <span className="text-xs text-muted-foreground ml-2">
            Using {fluidMethod === "clamp" ? "CSS Clamp" : "CSS Locks"} method
          </span>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="inline-flex h-auto p-1 vercel-border rounded-lg">
          <TabsTrigger
            value="css"
            className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
          >
            CSS Variables
          </TabsTrigger>
          <TabsTrigger
            value="scss"
            className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
          >
            SCSS/Sass
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
          >
            JSON
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-muted/50 backdrop-blur-sm p-4 rounded-lg border border-border/50">
        <pre className="text-xs overflow-auto max-h-[300px] whitespace-pre">
          <code>{getExportContent()}</code>
        </pre>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-md">
          {copied ? (
            <Check className="h-4 w-4 mr-1 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-1 text-foreground" />
          )}
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-md">
          <Download className="h-4 w-4 mr-1 text-foreground" />
          Download
        </Button>
      </div>
    </div>
  )
}
