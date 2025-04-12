"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface FontSelectorProps {
  value: string
  onValueChange: (value: string) => void
  fonts: string[]
  label: string
  id: string
}

export function FontSelector({ value, onValueChange, fonts, label, id }: FontSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFonts, setFilteredFonts] = useState(fonts)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter fonts based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredFonts(fonts.filter((font) => font.toLowerCase().includes(searchTerm.toLowerCase())))
    } else {
      setFilteredFonts(fonts)
    }
  }, [searchTerm, fonts])

  // Focus search input when popover opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchTerm("")
    }
  }, [open])

  // Load fonts when dropdown opens
  useEffect(() => {
    if (open) {
      // Create a link element for each font
      filteredFonts.forEach((font) => {
        const fontName = font.replace(/ /g, "+")
        const link = document.createElement("link")
        link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`
        link.rel = "stylesheet"
        document.head.appendChild(link)
      })
    }
  }, [open, filteredFonts])

  return (
    <div className="space-y-2.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between focus-visible:ring-primary"
            id={id}
          >
            <span style={{ fontFamily: `"${value}", sans-serif` }}>{value}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] p-0"
          align="start"
          side="bottom"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-2 sticky top-0 bg-background z-10 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 focus-visible:ring-primary"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-1">
              {filteredFonts.map((font) => (
                <Button
                  key={font}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal h-auto py-3",
                    value === font && "bg-primary/10 text-primary",
                  )}
                  onClick={() => {
                    onValueChange(font)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center w-full">
                    <Check className={cn("mr-2 h-4 w-4 flex-shrink-0", value === font ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                      <span
                        className="text-base"
                        style={{
                          fontFamily: `"${font}", sans-serif`,
                        }}
                      >
                        {font}
                      </span>
                      <span
                        className="text-xs text-muted-foreground mt-0.5"
                        style={{
                          fontFamily: `"${font}", sans-serif`,
                        }}
                      >
                        The quick brown fox
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  )
}
