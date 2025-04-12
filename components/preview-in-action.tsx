"use client"

import { useState, useEffect } from "react"
import type { TypographySettings, FontSettings } from "@/components/typescale-calculator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"
import {
  Monitor,
  Smartphone,
  ArrowRight,
  ChevronRight,
  Globe,
  BookOpen,
  FileText,
  Check,
  Search,
  Menu,
  ImageIcon,
  PlusCircle,
  MinusCircle,
  Calendar,
  Clock,
  Heart,
  BookmarkPlus,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ChevronLeft,
} from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Update the PreviewInAction component to accept setScaleShift prop
interface PreviewInActionProps {
  settings: TypographySettings
  scale: Record<string, number>
  updateFontSettings: (type: "headings" | "body", newSettings: Partial<FontSettings>) => void
  scaleShift: number
  setScaleShift: (value: number) => void
  fluidTypography: boolean
  minViewport: number
  maxViewport: number
  minFontSize: number
  maxFontSize: number
  minScaleRatio: number
  maxScaleRatio: number
  fluidMethod: "clamp" | "locks"
}

export default function PreviewInAction({
  settings,
  scale,
  updateFontSettings,
  scaleShift,
  setScaleShift,
  fluidTypography,
  minViewport,
  maxViewport,
  minFontSize,
  maxFontSize,
  minScaleRatio,
  maxScaleRatio,
  fluidMethod,
}: PreviewInActionProps) {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [templateType, setTemplateType] = useState<"website" | "blog" | "blog-post" | "docs">("website")
  const { theme } = useTheme()
  const isMobile = useMobile()
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">(isMobile ? "mobile" : "desktop")

  // Update viewMode when device type changes
  useEffect(() => {
    setViewMode(isMobile ? "mobile" : "desktop")
  }, [isMobile])

  // Add fluid typography calculations if needed
  const calculateFluidScale = (minSize: number, maxSize: number, viewport: number): number => {
    if (!fluidTypography) return minSize

    // Calculate the interpolated size based on viewport
    const viewportRatio = (viewport - minViewport) / (maxViewport - minViewport)
    const clampedRatio = Math.max(0, Math.min(1, viewportRatio)) // Ensure ratio is between 0 and 1
    return minSize + (maxSize - minSize) * clampedRatio
  }

  // Calculate fluid base size and ratio for the current viewport
  const fluidBaseSize = calculateFluidScale(
    minFontSize,
    maxFontSize,
    viewMode === "mobile" ? minViewport + 100 : maxViewport - 200,
  )
  const fluidRatio = calculateFluidScale(
    minScaleRatio,
    maxScaleRatio,
    viewMode === "mobile" ? minViewport + 100 : maxViewport - 200,
  )

  // Calculate fluid scale
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

  const fluidScale = baseFluidScale

  // Add the calculation for min and max scales
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

  // Auto-adjust background color when theme changes
  useEffect(() => {
    if (theme === "dark") {
      setBackgroundColor("#1a1a1a")
    } else {
      setBackgroundColor("#ffffff")
    }
  }, [theme])

  // Update the getHeadingStyle function to properly use the fluid typography settings
  const getHeadingStyle = (level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    const sizeFactor = viewMode === "mobile" ? 0.75 : 1

    if (fluidTypography) {
      // For fluid typography, we need to use the same calculation as in the main Preview component
      // Generate CSS clamp function for fluid typography
      const generateClamp = (minSize: number, maxSize: number): string => {
        // Calculate the slope and intercept for the linear equation
        const slope = (maxSize - minSize) / (maxViewport - minViewport)
        const intercept = minSize - slope * minViewport

        // Format the preferred value (linear equation based on viewport width)
        const preferredValue = `${slope * 100}vw + ${intercept}px`

        return `clamp(${minSize * sizeFactor}px, ${preferredValue}, ${maxSize * sizeFactor}px)`
      }

      // Generate CSS locks for fluid typography
      const generateCSSLock = (minSize: number, maxSize: number): string => {
        // Calculate the slope for the linear equation
        const slope = (maxSize - minSize) / (maxViewport - minViewport)

        // Format the CSS lock
        return `calc(${minSize * sizeFactor}px + ${slope * 100}vw * (100vw - ${minViewport}px) / ${maxViewport - minViewport})`
      }

      return {
        fontFamily: `"${settings.headings.family}", sans-serif`,
        fontSize:
          fluidMethod === "clamp"
            ? generateClamp(minScale[level], maxScale[level])
            : generateCSSLock(minScale[level], maxScale[level]),
        fontWeight: settings.headings.weight,
        letterSpacing: settings.headings.letterSpacing,
        lineHeight: settings.headings.lineHeight,
        color: settings.headings.color,
        margin: "0.5em 0",
      }
    } else {
      // For static typography, use the scale directly
      return {
        fontFamily: `"${settings.headings.family}", sans-serif`,
        fontSize: `${scale[level] * sizeFactor}px`,
        fontWeight: settings.headings.weight,
        letterSpacing: settings.headings.letterSpacing,
        lineHeight: settings.headings.lineHeight,
        color: settings.headings.color,
        margin: "0.5em 0",
      }
    }
  }

  // Update the getBodyStyle function to properly use the fluid typography settings
  const getBodyStyle = (size: "p" | "small" | "smaller") => {
    const sizeFactor = viewMode === "mobile" ? 0.85 : 1

    if (fluidTypography) {
      // For fluid typography, we need to use the same calculation as in the main Preview component
      // Generate CSS clamp function for fluid typography
      const generateClamp = (minSize: number, maxSize: number): string => {
        // Calculate the slope and intercept for the linear equation
        const slope = (maxSize - minSize) / (maxViewport - minViewport)
        const intercept = minSize - slope * minViewport

        // Format the preferred value (linear equation based on viewport width)
        const preferredValue = `${slope * 100}vw + ${intercept}px`

        return `clamp(${minSize * sizeFactor}px, ${preferredValue}, ${maxSize * sizeFactor}px)`
      }

      // Generate CSS locks for fluid typography
      const generateCSSLock = (minSize: number, maxSize: number): string => {
        // Calculate the slope for the linear equation
        const slope = (maxSize - minSize) / (maxViewport - minViewport)

        // Format the CSS lock
        return `calc(${minSize * sizeFactor}px + ${slope * 100}vw * (100vw - ${minViewport}px) / ${maxViewport - minViewport})`
      }

      return {
        fontFamily: `"${settings.body.family}", sans-serif`,
        fontSize:
          fluidMethod === "clamp"
            ? generateClamp(minScale[size], maxScale[size])
            : generateCSSLock(minScale[size], maxScale[size]),
        fontWeight: settings.body.weight,
        letterSpacing: settings.body.letterSpacing,
        lineHeight: settings.body.lineHeight,
        color: settings.body.color,
        margin: "0.5em 0",
      }
    } else {
      // For static typography, use the scale directly
      return {
        fontFamily: `"${settings.body.family}", sans-serif`,
        fontSize: `${scale[size] * sizeFactor}px`,
        fontWeight: settings.body.weight,
        letterSpacing: settings.body.letterSpacing,
        lineHeight: settings.body.lineHeight,
        color: settings.body.color,
        margin: "0.5em 0",
      }
    }
  }

  // Helper for button styles
  const getButtonStyle = (primary = true) => {
    const baseStyle = {
      fontFamily: settings.body.family,
      fontSize: `${scale.p * (viewMode === "mobile" ? 0.85 : 1)}px`,
      fontWeight: settings.body.weight,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5em 1em",
      borderRadius: "0.375em",
      transition: "all 0.2s ease",
      cursor: "pointer",
    }

    if (primary) {
      return {
        ...baseStyle,
        backgroundColor: primary === true ? "#B272FF" : settings.headings.color,
        color: "#FFFFFF",
        border: "none",
      }
    } else {
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: "#B272FF",
        border: `1px solid #B272FF`,
      }
    }
  }

  // Helper for card styles
  const getCardStyle = () => {
    return {
      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      borderRadius: "0.75em",
      padding: "1.5em",
      boxShadow: theme === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }
  }

  const getContainerWidth = () => {
    return viewMode === "mobile" ? "max-w-sm" : ""
  }

  return (
    <div className="space-y-6">
      {/* Add Scale Range controls to the header section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Preview in Action</h2>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScaleShift((prev) => prev + 1)}
              title="Add larger size (shift scale up)"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              Scale Range: {scaleShift > 0 ? `+${scaleShift}` : scaleShift}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScaleShift((prev) => prev - 1)}
              title="Add smaller size (shift scale down)"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
          </div>
          {fluidTypography && (
            <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Fluid Typography</div>
          )}

          {/* Update the Desktop/Mobile buttons to remove hover effect on active buttons */}
          <div className="flex p-1 vercel-border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("desktop")}
              className={`rounded-md ${viewMode === "desktop" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/80 hover:bg-muted"}`}
            >
              <Monitor className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Desktop</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("mobile")}
              className={`rounded-md ${viewMode === "mobile" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/80 hover:bg-muted"}`}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Mobile</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Improved color controls layout - Updated to match Calculator tab styling */}
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="backgroundColor" className="block mb-2">
              Background Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headingsColor" className="block mb-2">
              Headings Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="headingsColor"
                type="color"
                value={settings.headings.color}
                onChange={(e) => updateFontSettings("headings", { color: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={settings.headings.color}
                onChange={(e) => updateFontSettings("headings", { color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bodyColor" className="block mb-2">
              Body Text Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="bodyColor"
                type="color"
                value={settings.body.color}
                onChange={(e) => updateFontSettings("body", { color: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={settings.body.color}
                onChange={(e) => updateFontSettings("body", { color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Type Selector */}
      <div className="flex justify-start mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        {/* Update the template type selector buttons to remove hover effect on active buttons */}
        <div className="inline-flex p-1 vercel-border rounded-lg min-w-max">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTemplateType("website")}
            className={`rounded-md ${templateType === "website" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/80 hover:bg-muted"}`}
          >
            <Globe className="h-4 w-4 mr-2" />
            Website
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTemplateType("blog")}
            className={`rounded-md ${templateType === "blog" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/80 hover:bg-muted"}`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Blog
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTemplateType("blog-post")}
            className={`rounded-md ${templateType === "blog-post" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/80 hover:bg-muted"}`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Blog Post
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTemplateType("docs")}
            className={`rounded-md ${templateType === "docs" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/80 hover:bg-muted"}`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      {/* WEBSITE TEMPLATE */}
      {templateType === "website" && (
        <div
          className={`mx-auto border rounded-lg overflow-hidden shadow-lg ${getContainerWidth()}`}
          style={{ backgroundColor }}
        >
          {/* Header with gradient background like blog pages */}
          <header
            style={{
              padding: "1.5rem",
              borderBottom: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
              background:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(178, 114, 255, 0.1), rgba(0, 0, 0, 0))"
                  : "linear-gradient(to right, rgba(178, 114, 255, 0.05), rgba(255, 255, 255, 0))",
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src="/nexscale-logo.svg"
                  alt="NexScale Logo"
                  width={viewMode === "mobile" ? 80 : 100}
                  height={viewMode === "mobile" ? 24 : 30}
                  className={theme === "dark" ? "invert" : ""}
                />
              </div>

              <div className="flex items-center gap-4">
                {viewMode !== "mobile" && (
                  <nav className="flex gap-6">
                    {["Features", "Pricing", "Documentation", "Blog"].map((item) => (
                      <div
                        key={item}
                        style={{
                          ...getBodyStyle("p"),
                          cursor: "pointer",
                          margin: 0,
                          padding: 0,
                          fontWeight: item === "Features" ? "600" : "normal",
                          color: item === "Features" ? "#B272FF" : settings.body.color,
                          position: "relative",
                          paddingBottom: "2px",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </nav>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    style={{
                      backgroundColor: "#B272FF",
                      color: "white",
                    }}
                    size="sm"
                  >
                    Get Started
                  </Button>
                  {viewMode === "mobile" && (
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 lg:p-10">
            {/* Hero Section */}
            <section className="mb-16">
              <div className={`grid ${viewMode === "mobile" ? "grid-cols-1" : "grid-cols-12 gap-12"}`}>
                <div className={`space-y-6 ${viewMode === "mobile" ? "" : "col-span-7"}`}>
                  <div
                    style={{
                      ...getBodyStyle("small"),
                      backgroundColor: "#B272FF",
                      color: "#FFFFFF",
                      display: "inline-block",
                      padding: "0.5em 1em",
                      borderRadius: "2em",
                      marginBottom: "0.5em",
                    }}
                  >
                    TYPOGRAPHY MADE SIMPLE
                  </div>
                  <h1
                    style={{
                      ...getHeadingStyle("h1"),
                      marginBottom: "0.5em",
                      lineHeight: "1.1",
                    }}
                  >
                    Create beautiful, harmonious typography in minutes
                  </h1>
                  <p
                    style={{
                      ...getBodyStyle("p"),
                      marginBottom: "2em",
                      lineHeight: "1.7",
                    }}
                  >
                    NexScale helps designers and developers create consistent, readable typography with perfect
                    proportions. Adjust the base size and scale ratio to see how your typography scales across different
                    screen sizes.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      style={{
                        backgroundColor: "#B272FF",
                        color: "white",
                      }}
                      className="gap-2"
                    >
                      Try it free <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      style={{
                        borderColor: "#B272FF",
                        color: "#B272FF",
                      }}
                    >
                      Watch demo
                    </Button>
                  </div>
                </div>

                <div className={`${viewMode === "mobile" ? "mt-8" : "col-span-5"}`}>
                  <div
                    className="rounded-xl overflow-hidden h-full min-h-[200px] flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(178, 114, 255, 0.2) 0%, rgba(138, 79, 255, 0.2) 100%)",
                      boxShadow:
                        theme === "dark"
                          ? "0 20px 30px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                          : "0 20px 30px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="text-center p-6">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                        style={{
                          backgroundColor: "#B272FF",
                        }}
                      >
                        <span
                          style={{
                            ...getHeadingStyle("h3"),
                            margin: 0,
                            color: "#FFFFFF",
                          }}
                        >
                          Aa
                        </span>
                      </div>
                      <div
                        style={{
                          ...getBodyStyle("p"),
                          fontWeight: "500",
                        }}
                      >
                        Typography Preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div
                className="mt-12 p-6 rounded-xl"
                style={{
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                  border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
                <div
                  style={{
                    ...getBodyStyle("small"),
                    fontWeight: "600",
                    marginBottom: "1em",
                    color: "#B272FF",
                  }}
                >
                  TRUSTED BY DESIGNERS AT:
                </div>
                <div className="flex flex-wrap gap-6">
                  {["PixelCraft", "DesignHub", "CreativeFlow", "VisualSphere", "ArtisanUI"].map((company, index) => (
                    <div
                      key={index}
                      style={{
                        ...getBodyStyle("p"),
                        fontWeight: "500",
                        margin: 0,
                      }}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2
                  style={{
                    ...getHeadingStyle("h2"),
                    marginBottom: "0.5em",
                  }}
                >
                  Why Typography Matters
                </h2>
                <p
                  style={{
                    ...getBodyStyle("p"),
                    maxWidth: "800px",
                    margin: "0 auto",
                    lineHeight: "1.7",
                  }}
                >
                  Good typography is the foundation of good design. It enhances readability, establishes hierarchy, and
                  creates a consistent visual language.
                </p>
              </div>

              <div className={`grid ${viewMode === "mobile" ? "grid-cols-1" : "md:grid-cols-2"} gap-8`}>
                <div
                  className="rounded-xl p-6 transition-all hover:shadow-md"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <div
                    style={{
                      width: "3em",
                      height: "3em",
                      borderRadius: "0.5em",
                      backgroundColor: "#B272FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1em",
                    }}
                  >
                    <span
                      style={{
                        ...getHeadingStyle("h3"),
                        margin: 0,
                        color: "#FFFFFF",
                      }}
                    >
                      1
                    </span>
                  </div>
                  <h3 style={getHeadingStyle("h3")} className="mb-2">
                    Readability
                  </h3>
                  <p style={{ ...getBodyStyle("p"), lineHeight: "1.7" }}>
                    Good typography enhances readability and makes your content more accessible to all users. It's the
                    foundation of good design and user experience.
                  </p>
                  <p style={{ ...getBodyStyle("p"), lineHeight: "1.7" }}>
                    When text is easy to read, users are more likely to engage with your content and stay on your site
                    longer. This leads to better conversion rates and a more positive user experience.
                  </p>
                  <Button variant="ghost" className="mt-4 p-0 h-auto flex items-center gap-2 text-primary">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  className="rounded-xl p-6 transition-all hover:shadow-md"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <div
                    style={{
                      width: "3em",
                      height: "3em",
                      borderRadius: "0.5em",
                      backgroundColor: "#B272FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1em",
                    }}
                  >
                    <span
                      style={{
                        ...getHeadingStyle("h3"),
                        margin: 0,
                        color: "#FFFFFF",
                      }}
                    >
                      2
                    </span>
                  </div>
                  <h3 style={getHeadingStyle("h3")} className="mb-2">
                    Visual Hierarchy
                  </h3>
                  <p style={{ ...getBodyStyle("p"), lineHeight: "1.7" }}>
                    A well-designed type scale creates clear visual hierarchy, guiding users through your content and
                    highlighting what's most important.
                  </p>
                  <p style={{ ...getBodyStyle("p"), lineHeight: "1.7" }}>
                    By using different sizes, weights, and styles, you can create a clear path for users to follow,
                    making your content more digestible and engaging.
                  </p>
                  <Button variant="ghost" className="mt-4 p-0 h-auto flex items-center gap-2 text-primary">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Features Cards Section */}
            <section className="mb-16">
              <h2
                style={{
                  ...getHeadingStyle("h2"),
                  textAlign: "center",
                  marginBottom: "1em",
                }}
              >
                Features
              </h2>
              <div className={`grid ${viewMode === "mobile" ? "grid-cols-1" : "md:grid-cols-3"} gap-8`}>
                {[
                  {
                    title: "Customizable Scale",
                    description:
                      "Choose from predefined scales like the Golden Ratio or create your own custom scale to match your design needs.",
                    features: ["Multiple predefined scales", "Custom ratio input", "Real-time preview"],
                  },
                  {
                    title: "Font Customization",
                    description:
                      "Choose from a wide selection of Google fonts, and customize weight, line height, and more.",
                    features: ["100+ Google fonts", "Complete style control", "Live font preview"],
                  },
                  {
                    title: "Export Options",
                    description:
                      "Export your typography scale as CSS variables, SCSS, or JSON to easily integrate with your projects.",
                    features: ["CSS variables", "SCSS/Sass mixins", "JSON for developers"],
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-xl transition-all hover:shadow-md"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                      border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div className="p-6">
                      <div
                        style={{
                          width: "2.5em",
                          height: "2.5em",
                          borderRadius: "0.5em",
                          backgroundColor: "#B272FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1em",
                        }}
                      >
                        <span
                          style={{
                            ...getHeadingStyle("h4"),
                            margin: 0,
                            color: "#FFFFFF",
                          }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <h4 style={getHeadingStyle("h4")} className="mb-2">
                        {feature.title}
                      </h4>
                      <p style={{ ...getBodyStyle("p"), lineHeight: "1.7" }}>{feature.description}</p>
                      <ul
                        style={{
                          ...getBodyStyle("p"),
                          listStyleType: "none",
                          padding: 0,
                          margin: "1em 0",
                          flex: 1,
                        }}
                      >
                        {feature.features.map((item, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "0.5em",
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" style={{ color: "#B272FF" }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Button variant="ghost" className="mt-4 p-0 h-auto flex items-center gap-2 text-primary">
                        Learn more <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing Section */}
            <section className="mb-16">
              <h2
                style={{
                  ...getHeadingStyle("h2"),
                  textAlign: "center",
                  marginBottom: "0.5em",
                }}
              >
                Pricing Plans
              </h2>
              <p
                style={{
                  ...getBodyStyle("p"),
                  maxWidth: "800px",
                  margin: "0 auto 2em",
                  textAlign: "center",
                  lineHeight: "1.7",
                }}
              >
                Choose the perfect plan for your needs. All plans include core typography features.
              </p>

              <div className={`grid ${viewMode === "mobile" ? "grid-cols-1" : "md:grid-cols-3"} gap-8`}>
                {[
                  {
                    name: "Free",
                    price: "$0",
                    description: "Perfect for individuals and small projects",
                    features: ["Basic typography scales", "5 font combinations", "Export as CSS", "1 project"],
                    cta: "Get Started",
                    popular: false,
                  },
                  {
                    name: "Pro",
                    price: "$19",
                    period: "/month",
                    description: "For professionals and growing teams",
                    features: [
                      "Advanced typography scales",
                      "Unlimited font combinations",
                      "Export as CSS, SCSS, or JSON",
                      "10 projects",
                      "Team collaboration",
                      "Priority support",
                    ],
                    cta: "Start Free Trial",
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "$49",
                    period: "/month",
                    description: "For large teams and organizations",
                    features: [
                      "Everything in Pro",
                      "Unlimited projects",
                      "Custom branding",
                      "API access",
                      "Dedicated support",
                      "SSO authentication",
                    ],
                    cta: "Contact Sales",
                    popular: false,
                  },
                ].map((plan, index) => (
                  <div
                    key={index}
                    className={`rounded-xl transition-all ${plan.popular ? "shadow-lg" : "hover:shadow-md"}`}
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                      border: plan.popular
                        ? `2px solid #B272FF`
                        : `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transform: plan.popular ? "scale(1.02)" : undefined,
                      zIndex: plan.popular ? 1 : 0,
                    }}
                  >
                    {plan.popular && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "20px",
                          backgroundColor: "#B272FF",
                          color: "#FFFFFF",
                          padding: "0.25em 1em",
                          borderRadius: "1em",
                          fontSize: "0.75em",
                          fontWeight: "500",
                        }}
                      >
                        Most Popular
                      </div>
                    )}
                    <div
                      style={{
                        padding: "1.5em",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3
                        style={{
                          ...getHeadingStyle("h3"),
                          marginBottom: "0.25em",
                        }}
                      >
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline mb-4">
                        <span
                          style={{
                            ...getHeadingStyle("h2"),
                            margin: 0,
                          }}
                        >
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span
                            style={{
                              ...getBodyStyle("small"),
                              opacity: 0.7,
                              marginLeft: "0.25em",
                            }}
                          >
                            {plan.period}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          ...getBodyStyle("p"),
                          marginBottom: "1.5em",
                          lineHeight: "1.7",
                        }}
                      >
                        {plan.description}
                      </p>
                      <ul
                        style={{
                          ...getBodyStyle("p"),
                          listStyleType: "none",
                          padding: 0,
                          margin: "0 0 1.5em 0",
                          flex: 1,
                        }}
                      >
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "0.75em",
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" style={{ color: "#B272FF" }} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        style={{
                          backgroundColor: plan.popular ? "#B272FF" : "transparent",
                          color: plan.popular ? "white" : "#B272FF",
                          border: plan.popular ? "none" : "1px solid #B272FF",
                        }}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="mb-16">
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  background: "linear-gradient(135deg, #B272FF 0%, #8A4FFF 100%)",
                  color: "white",
                }}
              >
                <h2
                  style={{
                    ...getHeadingStyle("h2"),
                    color: "white",
                    marginBottom: "0.5em",
                  }}
                >
                  Ready to transform your typography?
                </h2>
                <p
                  style={{
                    ...getBodyStyle("p"),
                    color: "rgba(255,255,255,0.9)",
                    maxWidth: "800px",
                    margin: "0 auto 2em",
                    lineHeight: "1.7",
                  }}
                >
                  Join thousands of designers and developers who use NexScale to create beautiful, harmonious typography
                  for their projects.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="secondary" size="lg">
                    Get Started for Free
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer
              className="mt-16 pt-8 border-t"
              style={{ borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
            >
              <div className={`grid ${viewMode === "mobile" ? "grid-cols-1 gap-8" : "md:grid-cols-4 gap-8"}`}>
                <div className="md:col-span-1">
                  <div className="mb-4">
                    <Image
                      src="/nexscale-logo.svg"
                      alt="NexScale Logo"
                      width={100}
                      height={30}
                      className={theme === "dark" ? "invert" : ""}
                    />
                  </div>
                  <p
                    style={{
                      ...getBodyStyle("small"),
                      marginBottom: "1em",
                      lineHeight: "1.7",
                    }}
                  >
                    A tool for designers and developers to create beautiful, harmonious typography.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1em",
                    }}
                  >
                    {["Twitter", "GitHub", "Discord", "LinkedIn"].map((social, i) => (
                      <div
                        key={i}
                        style={{
                          ...getBodyStyle("small"),
                          color: "#B272FF",
                          cursor: "pointer",
                        }}
                      >
                        {social}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <h6
                      style={{
                        ...getHeadingStyle("h6"),
                        marginBottom: "1em",
                      }}
                    >
                      Categories
                    </h6>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {["Typography", "Design", "Development", "Accessibility", "UX Research"].map((item, i) => (
                        <li
                          key={i}
                          style={{
                            marginBottom: "0.5em",
                          }}
                        >
                          <div
                            style={{
                              ...getBodyStyle("small"),
                              color: settings.body.color,
                              opacity: 0.8,
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            {item}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h6
                      style={{
                        ...getHeadingStyle("h6"),
                        marginBottom: "1em",
                      }}
                    >
                      Resources
                    </h6>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {["Style Guide", "Typography Tools", "Font Pairings", "Color Theory", "Accessibility"].map(
                        (item, i) => (
                          <li
                            key={i}
                            style={{
                              marginBottom: "0.5em",
                            }}
                          >
                            <div
                              style={{
                                ...getBodyStyle("small"),
                                color: settings.body.color,
                                opacity: 0.8,
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                            >
                              {item}
                            </div>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div>
                    <h6
                      style={{
                        ...getHeadingStyle("h6"),
                        marginBottom: "1em",
                      }}
                    >
                      Company
                    </h6>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {["About Us", "Contact", "Careers", "Privacy Policy", "Terms of Service"].map((item, i) => (
                        <li
                          key={i}
                          style={{
                            marginBottom: "0.5em",
                          }}
                        >
                          <div
                            style={{
                              ...getBodyStyle("small"),
                              color: settings.body.color,
                              opacity: 0.8,
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            {item}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                className="mt-12 pt-6 border-t flex justify-between items-center"
                style={{
                  borderColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    ...getBodyStyle("smaller"),
                    opacity: 0.6,
                  }}
                >
                  © {new Date().getFullYear()} NexScale. All rights reserved.
                </div>

                <div
                  style={{
                    ...getBodyStyle("smaller"),
                    opacity: 0.6,
                  }}
                >
                  Made with ♥ by the NexScale team
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* BLOG TEMPLATE */}
      {templateType === "blog" && (
        <div
          className={`mx-auto border rounded-lg overflow-hidden shadow-lg ${getContainerWidth()}`}
          style={{ backgroundColor }}
        >
          {/* Blog Post Header - Modern, clean design */}
          <header
            style={{
              padding: "1.5rem",
              borderBottom: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
              background:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(178, 114, 255, 0.1), rgba(0, 0, 0, 0))"
                  : "linear-gradient(to right, rgba(178, 114, 255, 0.05), rgba(255, 255, 255, 0))",
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src="/nexscale-logo.svg"
                  alt="NexScale Logo"
                  width={viewMode === "mobile" ? 80 : 100}
                  height={viewMode === "mobile" ? 24 : 30}
                  className={theme === "dark" ? "invert" : ""}
                />
                <div
                  style={{
                    ...getBodyStyle("small"),
                    fontWeight: "600",
                    color: "#B272FF",
                  }}
                >
                  BLOG
                </div>
              </div>

              <div className="flex items-center gap-4">
                {viewMode !== "mobile" && (
                  <nav className="flex gap-6">
                    {["Home", "Articles", "Categories", "About"].map((item) => (
                      <div
                        key={item}
                        style={{
                          ...getBodyStyle("p"),
                          cursor: "pointer",
                          margin: 0,
                          padding: 0,
                          fontWeight: item === "Articles" ? "600" : "normal",
                          color: item === "Articles" ? "#B272FF" : settings.body.color,
                          position: "relative",
                          paddingBottom: "2px",
                          ...(item === "Articles" && {
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: "-2px",
                              left: 0,
                              width: "100%",
                              height: "2px",
                              backgroundColor: "#B272FF",
                            },
                          }),
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </nav>
                )}

                <div className="flex items-center gap-2">
                  <Button variant={viewMode === "mobile" ? "ghost" : "outline"} size="sm" className="rounded-full">
                    <Search className="h-4 w-4" />
                    {viewMode !== "mobile" && <span className="ml-2">Search</span>}
                  </Button>
                  {viewMode === "mobile" && (
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 lg:p-10">
            <div className={`grid ${viewMode === "mobile" ? "grid-cols-1" : "grid-cols-12 gap-12"}`}>
              {/* Main Content */}
              <article className={`space-y-8 ${viewMode === "mobile" ? "" : "col-span-8"}`}>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <div
                    style={{
                      ...getBodyStyle("small"),
                      color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                    }}
                  >
                    <span className="hover:text-primary cursor-pointer">Home</span> /
                    <span className="hover:text-primary cursor-pointer"> Typography</span> /
                    <span className="text-primary"> The Science of Typography</span>
                  </div>
                </div>

                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="w-fit"
                      style={{
                        borderColor: "#B272FF",
                        color: "#B272FF",
                      }}
                    >
                      Typography
                    </Badge>
                    <Badge
                      variant="outline"
                      className="w-fit"
                      style={{
                        borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                        color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      }}
                    >
                      Design Theory
                    </Badge>
                  </div>

                  <h1
                    style={{
                      ...getHeadingStyle("h1"),
                      marginBottom: "0.5em",
                      lineHeight: "1.1",
                    }}
                  >
                    The Science of Typography: How Fonts Affect Readability and Comprehension
                  </h1>

                  <div className="flex items-center gap-4 mt-6">
                    <Avatar className="h-12 w-12 border-2" style={{ borderColor: "#B272FF" }}>
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                      <AvatarFallback style={{ backgroundColor: "#B272FF", color: "white" }}>JD</AvatarFallback>
                    </Avatar>

                    <div>
                      <div
                        style={{
                          ...getBodyStyle("p"),
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        Jessica Dawson
                      </div>
                      <div
                        style={{
                          ...getBodyStyle("small"),
                          color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                          margin: 0,
                        }}
                      >
                        Typography Specialist • March 24, 2025 • 8 min read
                      </div>
                    </div>
                  </div>
                </header>

                {/* Featured Image */}
                <div
                  className="relative rounded-xl overflow-hidden mb-8 h-80 md:h-96"
                  style={{
                    boxShadow:
                      theme === "dark"
                        ? "0 20px 30px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                        : "0 20px 30px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                    background: "linear-gradient(135deg, #B272FF 0%, #8A4FFF 100%)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-opacity-90 flex flex-col items-center">
                      <ImageIcon className="h-16 w-16 mb-2" />
                      <div
                        style={{
                          ...getBodyStyle("small"),
                          color: "white",
                          fontWeight: "500",
                        }}
                      >
                        Featured Image
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="space-y-6">
                  <p
                    style={{
                      ...getBodyStyle("p"),
                      fontSize: `${scale.p * 1.05}px`,
                      lineHeight: "1.7",
                    }}
                  >
                    Typography is more than just choosing pretty fonts—it's a science that affects how we process
                    information. Research shows that the right typography choices can increase reading speed by up to
                    50% and significantly improve comprehension.
                  </p>

                  <h2
                    style={{
                      ...getHeadingStyle("h2"),
                      marginTop: "1.5em",
                    }}
                  >
                    The Psychology Behind Font Choices
                  </h2>

                  <p
                    style={{
                      ...getBodyStyle("p"),
                      lineHeight: "1.7",
                    }}
                  >
                    Different fonts evoke different emotional responses. Serif fonts like Times New Roman are often
                    perceived as traditional and authoritative, while sans-serif fonts like Helvetica are seen as modern
                    and clean. Understanding these psychological associations can help you choose fonts that align with
                    your brand's personality and message.
                  </p>

                  <div
                    className="rounded-xl p-6 my-8"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(178, 114, 255, 0.1)" : "rgba(178, 114, 255, 0.05)",
                      borderLeft: "4px solid #B272FF",
                    }}
                  >
                    <blockquote
                      style={{
                        ...getBodyStyle("p"),
                        fontStyle: "italic",
                        fontSize: `${scale.p * 1.1}px`,
                      }}
                    >
                      "Typography is what language looks like. Good typography is measured by how well it reinforces the
                      meaning of the text, not by some abstract scale of merit."
                    </blockquote>
                    <div
                      style={{
                        ...getBodyStyle("small"),
                        fontWeight: "600",
                        marginTop: "1em",
                        color: "#B272FF",
                      }}
                    >
                      — Robert Bringhurst, The Elements of Typographic Style
                    </div>
                  </div>

                  <h2
                    style={{
                      ...getHeadingStyle("h2"),
                      marginTop: "1.5em",
                    }}
                  >
                    Key Elements of Readable Typography
                  </h2>

                  <p
                    style={{
                      ...getBodyStyle("p"),
                      lineHeight: "1.7",
                    }}
                  >
                    Several factors contribute to the readability of your text:
                  </p>

                  <ul className="space-y-2 list-disc pl-6">
                    <li
                      style={{
                        ...getBodyStyle("p"),
                        lineHeight: "1.7",
                      }}
                    >
                      <strong>Font Size:</strong> Text that's too small strains the eyes, while text that's too large
                      can be difficult to scan. The ideal font size depends on the specific font and the context in
                      which it's used.
                    </li>
                    <li
                      style={{
                        ...getBodyStyle("p"),
                        lineHeight: "1.7",
                      }}
                    >
                      <strong>Line Height:</strong> Proper spacing between lines prevents text from feeling cramped and
                      improves readability. A line height of 1.5 to 1.6 times the font size is generally recommended for
                      body text.
                    </li>
                    <li
                      style={{
                        ...getBodyStyle("p"),
                        lineHeight: "1.7",
                      }}
                    >
                      <strong>Line Length:</strong> Lines that are too long make it difficult for readers to track from
                      the end of one line to the beginning of the next. Aim for 50-75 characters per line for optimal
                      readability.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Sidebar */}
              <aside className={`${viewMode === "mobile" ? "" : "col-span-4"}`}>
                {/* Author Card */}
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 border-2" style={{ borderColor: "#B272FF" }}>
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Author" />
                      <AvatarFallback style={{ backgroundColor: "#B272FF", color: "white" }}>JD</AvatarFallback>
                    </Avatar>
                    <h3
                      style={{
                        ...getHeadingStyle("h4"),
                        margin: "0 0 0.25rem",
                      }}
                    >
                      Jessica Dawson
                    </h3>
                    <p
                      style={{
                        ...getBodyStyle("small"),
                        color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                        margin: "0 0 1rem",
                      }}
                    >
                      Typography Specialist
                    </p>
                    <Button
                      style={{
                        backgroundColor: "#B272FF",
                        color: "white",
                      }}
                      className="w-full"
                    >
                      Follow
                    </Button>
                  </div>
                </div>

                {/* Table of Contents */}
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <h3
                    style={{
                      ...getHeadingStyle("h5"),
                      marginTop: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Table of Contents
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: "#B272FF",
                          textDecoration: "none",
                        }}
                      >
                        Introduction
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        The Psychology Behind Font Choices
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        Key Elements of Readable Typography
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        The Impact of Typography on Comprehension
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        Practical Applications
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        Conclusion
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Related Articles */}
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <h3
                    style={{
                      ...getHeadingStyle("h5"),
                      marginTop: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Creating Perfect Type Scales for Web Design",
                        date: "March 20, 2025",
                      },
                      {
                        title: "Fluid Typography: Responsive Text Without Breakpoints",
                        date: "March 18, 2025",
                      },
                      {
                        title: "Font Pairing: The Ultimate Guide for Designers",
                        date: "March 15, 2025",
                      },
                    ].map((article, index) => (
                      <div key={index} className="flex gap-3">
                        <div
                          className="w-16 h-16 rounded-md flex-shrink-0 bg-muted flex items-center justify-center"
                          style={{
                            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                          }}
                        >
                          <ImageIcon className="h-4 w-4 opacity-50" />
                        </div>
                        <div>
                          <a
                            href="#"
                            style={{
                              ...getBodyStyle("p"),
                              fontWeight: "500",
                              margin: "0 0 0.25rem",
                              display: "block",
                              color: settings.body.color,
                              textDecoration: "none",
                            }}
                          >
                            {article.title}
                          </a>
                          <div
                            style={{
                              ...getBodyStyle("smaller"),
                              color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                            }}
                          >
                            {article.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: "linear-gradient(135deg, #B272FF 0%, #8A4FFF 100%)",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      ...getHeadingStyle("h5"),
                      marginTop: 0,
                      marginBottom: "1rem",
                      color: "white",
                    }}
                  >
                    Subscribe to our newsletter
                  </h3>
                  <p
                    style={{
                      ...getBodyStyle("small"),
                      color: "rgba(255,255,255,0.8)",
                      marginBottom: "1rem",
                    }}
                  >
                    Get the latest articles and resources sent to your inbox.
                  </p>
                  <Input
                    placeholder="Enter your email"
                    className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button variant="secondary" className="w-full">
                    Subscribe
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {/* BLOG POST TEMPLATE */}
      {templateType === "blog-post" && (
        <div
          className={`mx-auto border rounded-lg overflow-hidden shadow-lg ${getContainerWidth()}`}
          style={{ backgroundColor }}
        >
          {/* Blog Post Header - Modern, clean design */}
          <header
            style={{
              padding: "1.5rem",
              borderBottom: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
              background:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(178, 114, 255, 0.1), rgba(0, 0, 0, 0))"
                  : "linear-gradient(to right, rgba(178, 114, 255, 0.05), rgba(255, 255, 255, 0))",
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src="/nexscale-logo.svg"
                  alt="NexScale Logo"
                  width={viewMode === "mobile" ? 80 : 100}
                  height={viewMode === "mobile" ? 24 : 30}
                  className={theme === "dark" ? "invert" : ""}
                />
                <div
                  style={{
                    ...getBodyStyle("small"),
                    fontWeight: "600",
                    color: "#B272FF",
                  }}
                >
                  BLOG
                </div>
              </div>

              <div className="flex items-center gap-4">
                {viewMode !== "mobile" && (
                  <nav className="flex gap-6">
                    {["Home", "Articles", "Categories", "About"].map((item) => (
                      <div
                        key={item}
                        style={{
                          ...getBodyStyle("p"),
                          cursor: "pointer",
                          margin: 0,
                          padding: 0,
                          fontWeight: item === "Articles" ? "600" : "normal",
                          color: item === "Articles" ? "#B272FF" : settings.body.color,
                          position: "relative",
                          paddingBottom: "2px",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </nav>
                )}

                <div className="flex items-center gap-2">
                  <Button variant={viewMode === "mobile" ? "ghost" : "outline"} size="sm" className="rounded-full">
                    <Search className="h-4 w-4" />
                    {viewMode !== "mobile" && <span className="ml-2">Search</span>}
                  </Button>
                  {viewMode === "mobile" && (
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 lg:p-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                <ChevronLeft className="h-3 w-3" />
                <span style={{ ...getBodyStyle("small"), margin: 0 }}>Back to Blog</span>
              </Button>
            </div>

            <div className={`grid ${viewMode === "mobile" ? "grid-cols-1" : "grid-cols-12 gap-12"}`}>
              {/* Main Content */}
              <article className={`space-y-8 ${viewMode === "mobile" ? "" : "col-span-8"}`}>
                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="w-fit"
                      style={{
                        borderColor: "#B272FF",
                        color: "#B272FF",
                      }}
                    >
                      Typography
                    </Badge>
                    <Badge
                      variant="outline"
                      className="w-fit"
                      style={{
                        borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                        color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      }}
                    >
                      Design Theory
                    </Badge>
                  </div>

                  <h1
                    style={{
                      ...getHeadingStyle("h1"),
                      marginBottom: "0.5em",
                      lineHeight: "1.1",
                    }}
                  >
                    The Science of Typography: How Fonts Affect Readability and Comprehension
                  </h1>

                  <div className="flex items-center gap-4 mt-6">
                    <Avatar className="h-12 w-12 border-2" style={{ borderColor: "#B272FF" }}>
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                      <AvatarFallback style={{ backgroundColor: "#B272FF", color: "white" }}>JD</AvatarFallback>
                    </Avatar>

                    <div>
                      <div
                        style={{
                          ...getBodyStyle("p"),
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        Jessica Dawson
                      </div>
                      <div
                        style={{
                          ...getBodyStyle("small"),
                          color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                          margin: 0,
                        }}
                      >
                        Typography Specialist • March 24, 2025 • 8 min read
                      </div>
                    </div>
                  </div>
                </header>

                {/* Featured Image */}
                <div
                  className="relative rounded-xl overflow-hidden mb-8 h-80 md:h-96"
                  style={{
                    boxShadow:
                      theme === "dark"
                        ? "0 20px 30px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                        : "0 20px 30px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                    background: "linear-gradient(135deg, #B272FF 0%, #8A4FFF 100%)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-opacity-90 flex flex-col items-center">
                      <ImageIcon className="h-16 w-16 mb-2" />
                      <div
                        style={{
                          ...getBodyStyle("small"),
                          color: "white",
                          fontWeight: "500",
                        }}
                      >
                        Featured Image
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="space-y-6">
                  <p
                    style={{
                      ...getBodyStyle("p"),
                      fontSize: `${scale.p * 1.05}px`,
                      lineHeight: "1.7",
                    }}
                  >
                    Typography is more than just choosing pretty fonts—it's a science that affects how we process
                    information. Research shows that the right typography choices can increase reading speed by up to
                    50% and significantly improve comprehension.
                  </p>

                  <h2
                    style={{
                      ...getHeadingStyle("h2"),
                      marginTop: "1.5em",
                    }}
                  >
                    The Psychology Behind Font Choices
                  </h2>

                  <p
                    style={{
                      ...getBodyStyle("p"),
                      lineHeight: "1.7",
                    }}
                  >
                    Different fonts evoke different emotional responses. Serif fonts like Times New Roman are often
                    perceived as traditional and authoritative, while sans-serif fonts like Helvetica are seen as modern
                    and clean. Understanding these psychological associations can help you choose fonts that align with
                    your brand's personality and message.
                  </p>

                  <p
                    style={{
                      ...getBodyStyle("p"),
                      lineHeight: "1.7",
                    }}
                  >
                    Studies have shown that serif fonts are generally easier to read in printed materials, while
                    sans-serif fonts perform better on digital screens. This is because the serifs (the small decorative
                    flourishes at the ends of letter strokes) help guide the eye along the text in print, but can appear
                    fuzzy on low-resolution screens.
                  </p>

                  <div
                    className="rounded-xl p-6 my-8"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(178, 114, 255, 0.1)" : "rgba(178, 114, 255, 0.05)",
                      borderLeft: "4px solid #B272FF",
                    }}
                  >
                    <blockquote
                      style={{
                        ...getBodyStyle("p"),
                        fontStyle: "italic",
                        fontSize: `${scale.p * 1.1}px`,
                      }}
                    >
                      "Typography is what language looks like. Good typography is measured by how well it reinforces the
                      meaning of the text, not by some abstract scale of merit."
                    </blockquote>
                    <div
                      style={{
                        ...getBodyStyle("small"),
                        fontWeight: "600",
                        marginTop: "1em",
                        color: "#B272FF",
                      }}
                    >
                      — Robert Bringhurst, The Elements of Typographic Style
                    </div>
                  </div>

                  <h2
                    style={{
                      ...getHeadingStyle("h2"),
                      marginTop: "1.5em",
                    }}
                  >
                    Key Elements of Readable Typography
                  </h2>

                  <p
                    style={{
                      ...getBodyStyle("p"),
                      lineHeight: "1.7",
                    }}
                  >
                    Several factors contribute to the readability of your text:
                  </p>

                  <ul className="space-y-2 list-disc pl-6">
                    <li
                      style={{
                        ...getBodyStyle("p"),
                        lineHeight: "1.7",
                      }}
                    >
                      <strong>Font Size:</strong> Text that's too small strains the eyes, while text that's too large
                      can be difficult to scan. The ideal font size depends on the specific font and the context in
                      which it's used.
                    </li>
                    <li
                      style={{
                        ...getBodyStyle("p"),
                        lineHeight: "1.7",
                      }}
                    >
                      <strong>Line Height:</strong> Proper spacing between lines prevents text from feeling cramped and
                      improves readability. A line height of 1.5 to 1.6 times the font size is generally recommended for
                      body text.
                    </li>
                    <li
                      style={{
                        ...getBodyStyle("p"),
                        lineHeight: "1.7",
                      }}
                    >
                      <strong>Line Length:</strong> Lines that are too long make it difficult for readers to track from
                      the end of one line to the beginning of the next. Aim for 50-75 characters per line for optimal
                      readability.
                    </li>
                  </ul>

                  {/* Article Footer - Social Sharing */}
                  <div
                    className="flex flex-wrap justify-between items-center gap-4 border-t border-b py-6 my-8"
                    style={{
                      borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 rounded-full"
                        style={{
                          borderColor: "#B272FF",
                          color: "#B272FF",
                        }}
                      >
                        <Heart className="h-4 w-4" />
                        Like
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-full">
                        <BookmarkPlus className="h-4 w-4" />
                        Save
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span style={{ ...getBodyStyle("small"), margin: 0 }}>Share:</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Author Bio */}
                  <div
                    className="rounded-xl p-6 my-8"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                      border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      <Avatar className="h-20 w-20 border-2" style={{ borderColor: "#B272FF" }}>
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Author" />
                        <AvatarFallback style={{ backgroundColor: "#B272FF", color: "white" }}>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3
                          style={{
                            ...getHeadingStyle("h4"),
                            margin: "0 0 0.5rem",
                          }}
                        >
                          About Jessica Dawson
                        </h3>
                        <p
                          style={{
                            ...getBodyStyle("p"),
                            margin: "0 0 1rem",
                          }}
                        >
                          Jessica is a typography specialist with over 10 years of experience in design and research.
                          She has worked with major brands to optimize their typography for better user experiences.
                        </p>
                        <Button
                          style={{
                            backgroundColor: "#B272FF",
                            color: "white",
                          }}
                          size="sm"
                        >
                          View All Posts
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Related Posts */}
                  <div className="mt-12">
                    <h3
                      style={{
                        ...getHeadingStyle("h3"),
                        marginBottom: "1rem",
                      }}
                    >
                      Related Articles
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                      {[
                        {
                          title: "Creating Perfect Type Scales for Web Design",
                          date: "March 20, 2025",
                        },
                        {
                          title: "Fluid Typography: Responsive Text Without Breakpoints",
                          date: "March 18, 2025",
                        },
                        {
                          title: "Font Pairing: The Ultimate Guide for Designers",
                          date: "March 15, 2025",
                        },
                      ].map((article, index) => (
                        <div
                          key={index}
                          className="rounded-xl overflow-hidden transition-all hover:shadow-md"
                          style={{
                            border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                          }}
                        >
                          <div
                            className="h-40 relative"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(178, 114, 255, 0.2) 0%, rgba(138, 79, 255, 0.2) 100%)",
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 opacity-50" />
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                  borderColor: "#B272FF",
                                  color: "#B272FF",
                                }}
                              >
                                Typography
                              </Badge>
                            </div>
                            <h4
                              style={{
                                ...getHeadingStyle("h5"),
                                margin: "0 0 0.5rem",
                              }}
                            >
                              {article.title}
                            </h4>
                            <div
                              style={{
                                ...getBodyStyle("smaller"),
                                color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                              }}
                            >
                              {article.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className={`${viewMode === "mobile" ? "" : "col-span-4"}`}>
                {/* Table of Contents */}
                <div
                  className="rounded-xl p-6 mb-6 sticky top-4"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <h3
                    style={{
                      ...getHeadingStyle("h5"),
                      marginTop: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Table of Contents
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: "#B272FF",
                          textDecoration: "none",
                        }}
                      >
                        Introduction
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        The Psychology Behind Font Choices
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        Key Elements of Readable Typography
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        The Impact of Typography on Comprehension
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        Practical Applications
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{
                          ...getBodyStyle("p"),
                          color: settings.body.color,
                          textDecoration: "none",
                        }}
                      >
                        Conclusion
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Author Card */}
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 border-2" style={{ borderColor: "#B272FF" }}>
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Author" />
                      <AvatarFallback style={{ backgroundColor: "#B272FF", color: "white" }}>JD</AvatarFallback>
                    </Avatar>
                    <h3
                      style={{
                        ...getHeadingStyle("h4"),
                        margin: "0 0 0.25rem",
                      }}
                    >
                      Jessica Dawson
                    </h3>
                    <p
                      style={{
                        ...getBodyStyle("small"),
                        color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                        margin: "0 0 1rem",
                      }}
                    >
                      Typography Specialist
                    </p>
                    <Button
                      style={{
                        backgroundColor: "#B272FF",
                        color: "white",
                      }}
                      className="w-full"
                    >
                      Follow
                    </Button>
                  </div>
                </div>

                {/* Related Articles */}
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <h3
                    style={{
                      ...getHeadingStyle("h5"),
                      marginTop: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Popular Articles
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Creating Perfect Type Scales for Web Design",
                        date: "March 20, 2025",
                      },
                      {
                        title: "Fluid Typography: Responsive Text Without Breakpoints",
                        date: "March 18, 2025",
                      },
                      {
                        title: "Font Pairing: The Ultimate Guide for Designers",
                        date: "March 15, 2025",
                      },
                    ].map((article, index) => (
                      <div key={index} className="flex gap-3">
                        <div
                          className="w-16 h-16 rounded-md flex-shrink-0 bg-muted flex items-center justify-center"
                          style={{
                            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                          }}
                        >
                          <ImageIcon className="h-4 w-4 opacity-50" />
                        </div>
                        <div>
                          <a
                            href="#"
                            style={{
                              ...getBodyStyle("p"),
                              fontWeight: "500",
                              margin: "0 0 0.25rem",
                              display: "block",
                              color: settings.body.color,
                              textDecoration: "none",
                            }}
                          >
                            {article.title}
                          </a>
                          <div
                            style={{
                              ...getBodyStyle("smaller"),
                              color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                            }}
                          >
                            {article.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: "linear-gradient(135deg, #B272FF 0%, #8A4FFF 100%)",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      ...getHeadingStyle("h5"),
                      marginTop: 0,
                      marginBottom: "1rem",
                      color: "white",
                    }}
                  >
                    Subscribe to our newsletter
                  </h3>
                  <p
                    style={{
                      ...getBodyStyle("small"),
                      color: "rgba(255,255,255,0.8)",
                      marginBottom: "1rem",
                    }}
                  >
                    Get the latest articles and resources sent to your inbox.
                  </p>
                  <Input
                    placeholder="Enter your email"
                    className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button variant="secondary" className="w-full">
                    Subscribe
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTATION TEMPLATE */}
      {templateType === "docs" && (
        <div
          className={`mx-auto border rounded-lg overflow-hidden shadow-lg ${getContainerWidth()}`}
          style={{ backgroundColor }}
        >
          {/* Header */}
          <header className="border-b p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/nexscale-logo.svg"
                alt="NexScale Logo"
                width={viewMode === "mobile" ? 80 : 100}
                height={viewMode === "mobile" ? 24 : 30}
                className={theme === "dark" ? "invert" : ""}
              />
              <Badge variant="outline" className="font-semibold">
                Docs
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {viewMode !== "mobile" && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search documentation..." className="w-[200px] pl-8" />
                </div>
              )}

              <Button size="sm">Get Started</Button>

              {viewMode === "mobile" && (
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
          </header>

          <div className="flex flex-col md:flex-row">
            {/* GitBook-style Sidebar */}
            {(viewMode !== "mobile" || true) && (
              <div
                className={`${viewMode === "mobile" ? "hidden" : "w-64"} border-r shrink-0`}
                style={{
                  borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                }}
              >
                <div className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="w-full pl-8" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium mb-2 text-muted-foreground">Getting Started</div>
                      <ul className="space-y-1">
                        {["Introduction", "Installation", "Quick Start"].map((item, i) => (
                          <li key={i}>
                            <Button
                              variant={i === 0 ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-left"
                            >
                              {item}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2 text-muted-foreground">Core Concepts</div>
                      <ul className="space-y-1">
                        {["Type Scales", "Scale Ratios", "Visual Hierarchy"].map((item, i) => (
                          <li key={i}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                              {item}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2 text-muted-foreground">Implementation</div>
                      <ul className="space-y-1">
                        {["CSS Variables", "SCSS Mixins", "React Components"].map((item, i) => (
                          <li key={i}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                              {item}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2 text-muted-foreground">Advanced</div>
                      <ul className="space-y-1">
                        {["Responsive Typography", "Fluid Typography", "Accessibility"].map((item, i) => (
                          <li key={i}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                              {item}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Getting Started</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">Introduction</span>
                </div>

                <h1 style={getHeadingStyle("h1")}>Introduction to Typography</h1>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span style={{ ...getBodyStyle("small"), margin: 0 }}>5 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span style={{ ...getBodyStyle("small"), margin: 0 }}>Updated April 2, 2025</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p style={getBodyStyle("p")}>
                    Typography is the art and technique of arranging type to make written language legible, readable,
                    and appealing when displayed. Good typography enhances readability, establishes hierarchy, and
                    creates a consistent visual language.
                  </p>

                  <h2 style={getHeadingStyle("h2")}>Why Typography Matters</h2>

                  <p style={getBodyStyle("p")}>Typography plays a crucial role in design for several reasons:</p>

                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li style={getBodyStyle("p")}>
                      <strong>Readability:</strong> Good typography makes content easy to read and understand.
                    </li>
                    <li style={getBodyStyle("p")}>
                      <strong>Brand Identity:</strong> Typography helps establish and reinforce brand identity.
                    </li>
                    <li style={getBodyStyle("p")}>
                      <strong>User Experience:</strong> Well-designed typography improves the overall user experience.
                    </li>
                    <li style={getBodyStyle("p")}>
                      <strong>Information Hierarchy:</strong> Typography helps create a clear hierarchy of information.
                    </li>
                  </ul>

                  <h2 style={getHeadingStyle("h2")}>Type Scales</h2>

                  <p style={getBodyStyle("p")}>
                    A type scale is a set of predefined font sizes that follow a specific ratio. Using a type scale
                    helps create harmony and consistency in your design.
                  </p>

                  <div
                    className="my-6 p-4 border rounded-lg"
                    style={{
                      borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    }}
                  >
                    <div className="font-medium mb-2" style={getBodyStyle("p")}>
                      Example Type Scale
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h1 style={getHeadingStyle("h1")}>Heading 1</h1>
                        <Badge variant="outline">{Math.round(scale.h1)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <h2 style={getHeadingStyle("h2")}>Heading 2</h2>
                        <Badge variant="outline">{Math.round(scale.h2)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 style={getHeadingStyle("h3")}>Heading 3</h3>
                        <Badge variant="outline">{Math.round(scale.h3)}px</Badge>
                      </div>
                    </div>
                  </div>

                  <h2 style={getHeadingStyle("h2")}>Getting Started with NexScale</h2>

                  <p style={getBodyStyle("p")}>
                    NexScale is a tool that helps you create beautiful, harmonious typography for your web projects.
                    With NexScale, you can:
                  </p>

                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li style={getBodyStyle("p")}>Create custom type scales based on different ratios</li>
                    <li style={getBodyStyle("p")}>Customize fonts, weights, line heights, and more</li>
                    <li style={getBodyStyle("p")}>Preview your typography in real-world contexts</li>
                    <li style={getBodyStyle("p")}>Export your typography as CSS, SCSS, or JSON</li>
                  </ul>

                  <div
                    className="my-6 p-4 border rounded-lg"
                    style={{
                      borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                    }}
                  >
                    <div className="font-medium mb-2" style={getBodyStyle("p")}>
                      Installation
                    </div>
                    <div className="bg-muted rounded-md p-3 relative">
                      <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        <code>npm install nexscale</code>
                      </pre>
                    </div>
                  </div>

                  <h2 style={getHeadingStyle("h2")}>Next Steps</h2>

                  <p style={getBodyStyle("p")}>
                    NexScale is a tool that helps you create beautiful, harmonious typography for your web projects.
                    With NexScale, you can:
                  </p>

                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li style={getBodyStyle("p")}>
                      <a href="#" className="text-primary hover:underline">
                        Install NexScale
                      </a>{" "}
                      in your project
                    </li>
                    <li style={getBodyStyle("p")}>
                      Learn more about{" "}
                      <a href="#" className="text-primary hover:underline">
                        type scales and ratios
                      </a>
                    </li>
                    <li style={getBodyStyle("p")}>
                      Explore{" "}
                      <a href="#" className="text-primary hover:underline">
                        implementation options
                      </a>{" "}
                      for your project
                    </li>
                  </ul>
                </div>

                <div
                  className="mt-12 pt-6 border-t flex items-center justify-between"
                  style={{
                    borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  }}
                >
                  <Button variant="outline" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div
                  className="mt-12 pt-6 border-t text-sm text-muted-foreground"
                  style={{
                    borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>Last updated: April 2, 2025</div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        Like
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
