"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BaseSettings } from "@/components/base-settings"
import { Preview } from "@/components/preview"
import { ExportOptions } from "@/components/export-options"
import { ThemeToggle } from "@/components/theme-toggle"
import PreviewInAction from "@/components/preview-in-action"
import { useTheme } from "next-themes"
import { FontCustomization } from "@/components/font-customization"
import Image from "next/image"

// Define the FontSettings type
export type FontSettings = {
  family: string
  weight: string
  letterSpacing: string
  lineHeight: string
  color: string
}

// Update the TypographySettings type to only have px for baseSize
export type TypographySettings = {
  baseSize: number // Always in px
  unit: "px" | "rem" | "em" | "pt" // For display only
  scaleRatio: number
  headings: FontSettings
  body: FontSettings
}

// Update the default settings to use Minor Third (1.2) as default
const defaultSettings: TypographySettings = {
  baseSize: 16, // Always in px
  unit: "px",
  scaleRatio: 1.2, // Minor third
  headings: {
    family: "Inter",
    weight: "600",
    letterSpacing: "-0.025em",
    lineHeight: "1.2",
    color: "#060606",
  },
  body: {
    family: "Inter",
    weight: "400",
    letterSpacing: "0",
    lineHeight: "1.5",
    color: "#333333",
  },
}

// Update the calculateScale function to only return one scale
const calculateScale = (base: number, ratio: number) => {
  return {
    h1: Math.round(base * Math.pow(ratio, 5) * 100) / 100,
    h2: Math.round(base * Math.pow(ratio, 4) * 100) / 100,
    h3: Math.round(base * Math.pow(ratio, 3) * 100) / 100,
    h4: Math.round(base * Math.pow(ratio, 2) * 100) / 100,
    h5: Math.round(base * Math.pow(ratio, 1) * 100) / 100,
    h6: Math.round(base * 100) / 100,
    p: base,
    small: Math.round((base / ratio) * 100) / 100,
    smaller: Math.round((base / (ratio * ratio)) * 100) / 100,
  }
}

// Completely new implementation of scale shifting
const calculateAdjustedScale = (
  baseScale: Record<string, number>,
  shift: number,
  scaleRatio: number,
): Record<string, number> => {
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
      const newH1 = Math.round(originalHeadings[0] * scaleRatio * 100) / 100

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
      const newH6 = Math.round((originalHeadings[5] / scaleRatio) * 100) / 100

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

// Update the component to use only one scale and remove responsive references
export function TypescaleCalculator() {
  const [settings, setSettings] = useState<TypographySettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState("calculator")
  const { theme } = useTheme()
  const [fontSource, setFontSource] = useState<"google">("google")

  // Add fluid typography state to the main component to share between Preview and Export
  // Add this after the other state declarations
  const [fluidTypography, setFluidTypography] = useState(false)
  const [minViewport, setMinViewport] = useState(320)
  const [maxViewport, setMaxViewport] = useState(1240)
  const [minFontSize, setMinFontSize] = useState(16)
  const [maxFontSize, setMaxFontSize] = useState(20)
  const [minScaleRatio, setMinScaleRatio] = useState(1.2)
  const [maxScaleRatio, setMaxScaleRatio] = useState(1.333)
  const [fluidMethod, setFluidMethod] = useState<"clamp" | "locks">("clamp")

  // Add scaleShift state
  const [scaleShift, setScaleShift] = useState(0)

  // Calculate the base scale
  const baseScale = calculateScale(settings.baseSize, settings.scaleRatio)

  // Update the scale calculation to use the adjusted scale
  // Replace:
  // const scale = calculateAdjustedScale(baseScale, scaleShift)

  // With:
  const scale = calculateAdjustedScale(baseScale, scaleShift, settings.scaleRatio)

  // Update settings
  const updateSettings = (newSettings: Partial<TypographySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Update heading or body settings
  const updateFontSettings = (type: "headings" | "body", newSettings: Partial<FontSettings>) => {
    setSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...newSettings,
      },
    }))
  }

  // Update the useEffect for theme changes to use #060606 for dark theme
  useEffect(() => {
    if (theme === "dark") {
      // Only update heading color if it's not already set to white or a light color
      if (settings.headings.color === "#060606" || settings.headings.color === "#333333") {
        updateFontSettings("headings", { color: "#ffffff" })
      }

      // Only update body color if it's not already set to a light color
      if (settings.body.color === "#333333" || settings.body.color === "#060606") {
        updateFontSettings("body", { color: "#e0e0e0" })
      }
    } else {
      // Only update heading color if it's not already set to dark
      if (settings.headings.color === "#ffffff" || settings.headings.color === "#e0e0e0") {
        updateFontSettings("headings", { color: "#060606" })
      }

      // Only update body color if it's not already set to dark
      if (settings.body.color === "#ffffff" || settings.body.color === "#e0e0e0") {
        updateFontSettings("body", { color: "#333333" })
      }
    }
  }, [theme]) // Only depend on theme changes

  // Load Google Fonts for the selected fonts
  useEffect(() => {
    // Load the currently selected fonts
    const headingFont = settings.headings.family.replace(/ /g, "+")
    const bodyFont = settings.body.family.replace(/ /g, "+")

    // Create link elements for the selected fonts
    const headingLink = document.createElement("link")
    headingLink.href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@${settings.headings.weight}&display=swap`
    headingLink.rel = "stylesheet"

    const bodyLink = document.createElement("link")
    bodyLink.href = `https://fonts.googleapis.com/css2?family=${bodyFont}:wght@${settings.body.weight}&display=swap`
    bodyLink.rel = "stylesheet"

    // Add links to head
    document.head.appendChild(headingLink)
    document.head.appendChild(bodyLink)

    // Cleanup function
    return () => {
      document.head.removeChild(headingLink)
      document.head.removeChild(bodyLink)
    }
  }, [settings.headings.family, settings.headings.weight, settings.body.family, settings.body.weight])

  return (
    <div className="min-h-screen bg-dot-pattern dark:bg-dot-pattern-dark noise-bg">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src="/nexscale-logo.svg" alt="NexScale Logo" width={120} height={35} className="dark:invert" />
              <div className="hidden md:block h-8 w-px bg-border"></div>
              <p className="hidden md:block text-sm font-medium text-foreground/80">A Modern Typescale Calculator</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-auto p-1 vercel-border rounded-lg">
            <TabsTrigger
              className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
              value="calculator"
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger
              className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
              value="preview"
            >
              Preview in Action
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="overflow-hidden vercel-card vercel-glow">
                  <CardContent className="pt-6">
                    <BaseSettings settings={settings} updateSettings={updateSettings} />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden vercel-card vercel-glow">
                  <CardContent className="pt-6">
                    <FontCustomization
                      settings={settings}
                      updateFontSettings={updateFontSettings}
                      fontSource={fontSource}
                      setFontSource={setFontSource}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden vercel-card vercel-glow">
                  <CardContent className="pt-6">
                    <Preview
                      settings={settings}
                      scale={scale}
                      fluidTypography={fluidTypography}
                      setFluidTypography={setFluidTypography}
                      minViewport={minViewport}
                      setMinViewport={setMinViewport}
                      maxViewport={maxViewport}
                      setMaxViewport={setMaxViewport}
                      minFontSize={minFontSize}
                      setMinFontSize={setMinFontSize}
                      maxFontSize={maxFontSize}
                      setMaxFontSize={setMaxFontSize}
                      minScaleRatio={minScaleRatio}
                      setMinScaleRatio={setMinScaleRatio}
                      maxScaleRatio={maxScaleRatio}
                      setMaxScaleRatio={setMaxScaleRatio}
                      fluidMethod={fluidMethod}
                      setFluidMethod={setFluidMethod}
                      scaleShift={scaleShift}
                      setScaleShift={setScaleShift}
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden vercel-card vercel-glow">
                  <CardContent className="pt-6">
                    <ExportOptions
                      settings={settings}
                      scale={scale}
                      fluidTypography={fluidTypography}
                      minViewport={minViewport}
                      maxViewport={maxViewport}
                      minFontSize={minFontSize}
                      maxFontSize={maxFontSize}
                      minScaleRatio={minScaleRatio}
                      maxScaleRatio={maxScaleRatio}
                      fluidMethod={fluidMethod}
                      scaleShift={scaleShift}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <PreviewInAction
              settings={settings}
              scale={scale}
              updateFontSettings={updateFontSettings}
              scaleShift={scaleShift}
              setScaleShift={setScaleShift}
              fluidTypography={fluidTypography}
              minViewport={minViewport}
              maxViewport={maxViewport}
              minFontSize={minFontSize}
              maxFontSize={maxFontSize}
              minScaleRatio={minScaleRatio}
              maxScaleRatio={maxScaleRatio}
              fluidMethod={fluidMethod}
            />
          </TabsContent>
        </Tabs>

        {/* Add this footer at the end, right before the closing div */}
        <footer className="mt-16 pt-6 border-t border-border/50 text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-between items-center">
            <div>© NexScale</div>
            <div className="flex gap-4">
              <a href="mailto:hello@nexoragency.com" className="hover:underline">
                Contact
              </a>
              <a href="/terms" className="hover:underline">
                Terms
              </a>
              <a href="/privacy" className="hover:underline">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
