"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import type { TypographySettings, FontSettings } from "@/components/typescale-calculator"
import { Separator } from "@/components/ui/separator"
import { Info, Type } from "lucide-react"
import { FontSelector } from "@/components/font-selector"

interface FontCustomizationProps {
  settings: TypographySettings
  updateFontSettings: (type: "headings" | "body", settings: Partial<FontSettings>) => void
  fontSource: "google"
  setFontSource: (source: "google") => void
}

// Expanded list of Google Fonts (100+)
const GOOGLE_FONTS = [
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Roboto Condensed",
  "Source Sans Pro",
  "Oswald",
  "Raleway",
  "Nunito",
  "Inter",
  "Poppins",
  "Playfair Display",
  "Merriweather",
  "PT Sans",
  "Ubuntu",
  "Rubik",
  "Work Sans",
  "Noto Sans",
  "Fira Sans",
  "Quicksand",
  "Mukta",
  "Heebo",
  "Arimo",
  "Titillium Web",
  "Manrope",
  "Oxygen",
  "Hind",
  "Karla",
  "Josefin Sans",
  "Libre Franklin",
  "Nunito Sans",
  "DM Sans",
  "Barlow",
  "Cabin",
  "Bitter",
  "IBM Plex Sans",
  "Comfortaa",
  "Exo 2",
  "Crimson Text",
  "Mulish",
  "Prompt",
  "Archivo",
  "Libre Baskerville",
  "Inconsolata",
  "Kanit",
  "Noto Serif",
  "Dosis",
  "Asap",
  "Catamaran",
  "Abel",
  "Signika",
  "Varela Round",
  "Teko",
  "Overpass",
  "Questrial",
  "Pacifico",
  "Caveat",
  "Dancing Script",
  "Shadows Into Light",
  "Lobster",
  "Indie Flower",
  "Permanent Marker",
  "Satisfy",
  "Great Vibes",
  "Sacramento",
  "Amatic SC",
  "Architects Daughter",
  "Fredoka One",
  "Righteous",
  "Courgette",
  "Kaushan Script",
  "Patua One",
  "Russo One",
  "Bebas Neue",
  "Passion One",
  "Bree Serif",
  "Acme",
  "Secular One",
  "Abril Fatface",
  "Alfa Slab One",
  "Lilita One",
  "Baloo 2",
  "Staatliches",
  "Francois One",
  "Yanone Kaffeesatz",
  "Fjalla One",
  "Crete Round",
  "Alegreya",
  "Alegreya Sans",
  "Vollkorn",
  "Cormorant Garamond",
  "Spectral",
  "Domine",
  "Lora",
  "Fira Code",
  "JetBrains Mono",
  "Source Code Pro",
  "Space Mono",
  "Space Grotesk",
  "Sora",
  "Outfit",
  "Urbanist",
  "Plus Jakarta Sans",
  "Lexend",
  "Epilogue",
  "Figtree",
  "Instrument Sans",
  "Geologica",
  "Gabarito",
  "Onest",
]

export function FontCustomization({ settings, updateFontSettings, fontSource, setFontSource }: FontCustomizationProps) {
  const [fontType, setFontType] = useState<"headings" | "body">("headings")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
          <Type className="h-5 w-5 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Font Customization</h2>
      </div>
      <Separator className="bg-border/50" />

      <Tabs value={fontType} onValueChange={(value) => setFontType(value as "headings" | "body")}>
        <TabsList className="inline-flex h-auto p-1 vercel-border rounded-lg">
          <TabsTrigger
            value="headings"
            className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
          >
            Headings
          </TabsTrigger>
          <TabsTrigger
            value="body"
            className="rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-background/80 data-[state=inactive]:hover:bg-muted"
          >
            Body Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="headings" className="pt-4 space-y-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 p-3 rounded-lg bg-muted/30 border border-border/50">
            <Info className="h-4 w-4 text-foreground" />
            <span>Using Google Fonts for better typography options</span>
          </div>

          <FontSelector
            id="headingsFont"
            label="Font Family"
            value={settings.headings.family}
            onValueChange={(value) => updateFontSettings("headings", { family: value })}
            fonts={GOOGLE_FONTS}
          />

          <div className="space-y-2.5">
            <Label htmlFor="headingsWeight" className="text-sm font-medium">
              Font Weight
            </Label>
            <Select
              value={settings.headings.weight}
              onValueChange={(value) => updateFontSettings("headings", { weight: value })}
            >
              <SelectTrigger id="headingsWeight" className="focus-visible:ring-primary">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 (Thin)</SelectItem>
                <SelectItem value="200">200 (Extra Light)</SelectItem>
                <SelectItem value="300">300 (Light)</SelectItem>
                <SelectItem value="400">400 (Regular)</SelectItem>
                <SelectItem value="500">500 (Medium)</SelectItem>
                <SelectItem value="600">600 (Semi Bold)</SelectItem>
                <SelectItem value="700">700 (Bold)</SelectItem>
                <SelectItem value="800">800 (Extra Bold)</SelectItem>
                <SelectItem value="900">900 (Black)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="headingsLineHeight" className="text-sm font-medium">
              Line Height
            </Label>
            <Input
              id="headingsLineHeight"
              type="text"
              value={settings.headings.lineHeight}
              onChange={(e) => updateFontSettings("headings", { lineHeight: e.target.value })}
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="headingsLetterSpacing" className="text-sm font-medium">
              Letter Spacing
            </Label>
            <Input
              id="headingsLetterSpacing"
              type="text"
              value={settings.headings.letterSpacing}
              onChange={(e) => updateFontSettings("headings", { letterSpacing: e.target.value })}
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="headingsColor" className="text-sm font-medium">
              Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="headingsColor"
                type="color"
                value={settings.headings.color}
                onChange={(e) => updateFontSettings("headings", { color: e.target.value })}
                className="w-12 h-10 p-1 focus-visible:ring-primary"
              />
              <Input
                type="text"
                value={settings.headings.color}
                onChange={(e) => updateFontSettings("headings", { color: e.target.value })}
                className="flex-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">
                Current font:{" "}
                <span
                  className="font-medium"
                  style={{
                    fontFamily: settings.headings.family,
                    fontWeight: settings.headings.weight,
                  }}
                >
                  {settings.headings.family} ({settings.headings.weight})
                </span>
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="body" className="pt-4 space-y-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 p-3 rounded-lg bg-muted/30 border border-border/50">
            <Info className="h-4 w-4 text-foreground" />
            <span>Using Google Fonts for better typography options</span>
          </div>

          <FontSelector
            id="bodyFont"
            label="Font Family"
            value={settings.body.family}
            onValueChange={(value) => updateFontSettings("body", { family: value })}
            fonts={GOOGLE_FONTS}
          />

          <div className="space-y-2.5">
            <Label htmlFor="bodyWeight" className="text-sm font-medium">
              Font Weight
            </Label>
            <Select
              value={settings.body.weight}
              onValueChange={(value) => updateFontSettings("body", { weight: value })}
            >
              <SelectTrigger id="bodyWeight" className="focus-visible:ring-primary">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 (Thin)</SelectItem>
                <SelectItem value="200">200 (Extra Light)</SelectItem>
                <SelectItem value="300">300 (Light)</SelectItem>
                <SelectItem value="400">400 (Regular)</SelectItem>
                <SelectItem value="500">500 (Medium)</SelectItem>
                <SelectItem value="600">600 (Semi Bold)</SelectItem>
                <SelectItem value="700">700 (Bold)</SelectItem>
                <SelectItem value="800">800 (Extra Bold)</SelectItem>
                <SelectItem value="900">900 (Black)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="bodyLineHeight" className="text-sm font-medium">
              Line Height
            </Label>
            <Input
              id="bodyLineHeight"
              type="text"
              value={settings.body.lineHeight}
              onChange={(e) => updateFontSettings("body", { lineHeight: e.target.value })}
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="bodyLetterSpacing" className="text-sm font-medium">
              Letter Spacing
            </Label>
            <Input
              id="bodyLetterSpacing"
              type="text"
              value={settings.body.letterSpacing}
              onChange={(e) => updateFontSettings("body", { letterSpacing: e.target.value })}
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="bodyColor" className="text-sm font-medium">
              Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="bodyColor"
                type="color"
                value={settings.body.color}
                onChange={(e) => updateFontSettings("body", { color: e.target.value })}
                className="w-12 h-10 p-1 focus-visible:ring-primary"
              />
              <Input
                type="text"
                value={settings.body.color}
                onChange={(e) => updateFontSettings("body", { color: e.target.value })}
                className="flex-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">
                Current font:{" "}
                <span
                  className="font-medium"
                  style={{
                    fontFamily: settings.body.family,
                    fontWeight: settings.body.weight,
                  }}
                >
                  {settings.body.family} ({settings.body.weight})
                </span>
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
