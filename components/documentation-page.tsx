"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTheme } from "next-themes"
import Image from "next/image"
import {
  Search,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Github,
  BookOpen,
  Code,
  Lightbulb,
  Ruler,
  Palette,
  Laptop,
  Smartphone,
  Tablet,
  Download,
  ArrowRight,
  Heart,
} from "lucide-react"

interface DocumentationPageProps {
  settings: any
  scale: Record<string, number>
}

export default function DocumentationPage({ settings, scale }: DocumentationPageProps) {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)

  // Helper function to get heading styles
  const getHeadingStyle = (level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    return {
      fontFamily: `"${settings.headings.family}", sans-serif`,
      fontSize: `${scale[level]}px`,
      fontWeight: settings.headings.weight,
      letterSpacing: settings.headings.letterSpacing,
      lineHeight: settings.headings.lineHeight,
      color: settings.headings.color,
      margin: "0.5em 0",
    }
  }

  // Helper function to get body text styles
  const getBodyStyle = (size: "p" | "small" | "smaller") => {
    return {
      fontFamily: `"${settings.body.family}", sans-serif`,
      fontSize: `${scale[size]}px`,
      fontWeight: settings.body.weight,
      letterSpacing: settings.body.letterSpacing,
      lineHeight: settings.body.lineHeight,
      color: settings.body.color,
      margin: "0.5em 0",
    }
  }

  // Helper function to copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Sample CSS code for the typography scale
  const typographyCSS = `:root {
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
}

/* Base typography styles */
body {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-headings);
  line-height: var(--line-height-headings);
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }
h5 { font-size: var(--font-size-h5); }
h6 { font-size: var(--font-size-h6); }

small { font-size: var(--font-size-small); }
.smaller { font-size: var(--font-size-smaller); }`

  // Documentation sections
  const docSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Learn the basics of typography and how to use NexScale",
      color: "#B272FF",
      topics: [
        { id: "introduction", title: "Introduction to Typography" },
        { id: "installation", title: "Installation & Setup" },
        { id: "quick-start", title: "Quick Start Guide" },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      icon: <Lightbulb className="h-5 w-5" />,
      description: "Understand the fundamental concepts of type scales",
      color: "#FF72B2",
      topics: [
        { id: "type-scales", title: "Understanding Type Scales" },
        { id: "ratios", title: "Scale Ratios Explained" },
        { id: "hierarchy", title: "Creating Visual Hierarchy" },
      ],
    },
    {
      id: "typography-tools",
      title: "Typography Tools",
      icon: <Ruler className="h-5 w-5" />,
      description: "Tools and utilities for working with typography",
      color: "#72B2FF",
      topics: [
        { id: "calculator", title: "Type Scale Calculator" },
        { id: "fluid-typography", title: "Fluid Typography" },
        { id: "font-pairing", title: "Font Pairing Guide" },
      ],
    },
    {
      id: "design-principles",
      title: "Design Principles",
      icon: <Palette className="h-5 w-5" />,
      description: "Best practices for typography in design",
      color: "#72FFB2",
      topics: [
        { id: "readability", title: "Readability & Legibility" },
        { id: "contrast", title: "Contrast & Color" },
        { id: "spacing", title: "Line Height & Spacing" },
      ],
    },
    {
      id: "implementation",
      title: "Implementation",
      icon: <Code className="h-5 w-5" />,
      description: "How to implement typography in your projects",
      color: "#FFB272",
      topics: [
        { id: "css-variables", title: "CSS Variables" },
        { id: "scss-mixins", title: "SCSS Mixins & Functions" },
        { id: "react-components", title: "React Components" },
      ],
    },
    {
      id: "responsive",
      title: "Responsive Typography",
      icon: <Laptop className="h-5 w-5" />,
      description: "Creating typography that works across devices",
      color: "#B2FF72",
      topics: [
        { id: "mobile-first", title: "Mobile-First Approach" },
        { id: "breakpoints", title: "Breakpoints & Media Queries" },
        { id: "testing", title: "Testing & Optimization" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/nexscale-logo.svg"
              alt="NexScale Logo"
              width={100}
              height={30}
              className={theme === "dark" ? "invert" : ""}
            />
            <Badge variant="outline" className="ml-2 font-semibold">
              Docs
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-[200px] lg:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" size="sm" className="hidden md:flex">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" style={{ backgroundColor: "#B272FF", color: "white" }}>
              Documentation
            </Badge>
            <h1 style={{ ...getHeadingStyle("h1"), margin: "0.5rem 0 1.5rem" }}>NexScale Typography Guide</h1>
            <p style={{ ...getBodyStyle("p"), fontSize: `${scale.p * 1.1}px`, marginBottom: "2rem" }}>
              Comprehensive documentation for creating beautiful, harmonious typography with NexScale
            </p>

            <div className="relative mx-auto mb-8 md:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" style={{ backgroundColor: "#B272FF" }}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                View on GitHub
                <Github className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Documentation Sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="mb-8 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {docSections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {docSections.map((section) => (
                  <Card key={section.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: section.color }}
                        >
                          <div className="text-white">{section.icon}</div>
                        </div>
                        <CardTitle>{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{section.description}</CardDescription>
                      <ul className="space-y-2">
                        {section.topics.map((topic) => (
                          <li key={topic.id} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <span style={getBodyStyle("p")}>{topic.title}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => setActiveTab(section.id)}
                      >
                        Explore {section.title}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Typography Examples */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle>Typography Scale Examples</CardTitle>
                  <CardDescription>See how your typography scale looks with the current settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-6">
                    <div className="space-y-4">
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
                      <div className="flex items-center justify-between">
                        <h4 style={getHeadingStyle("h4")}>Heading 4</h4>
                        <Badge variant="outline">{Math.round(scale.h4)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <h5 style={getHeadingStyle("h5")}>Heading 5</h5>
                        <Badge variant="outline">{Math.round(scale.h5)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <h6 style={getHeadingStyle("h6")}>Heading 6</h6>
                        <Badge variant="outline">{Math.round(scale.h6)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p style={getBodyStyle("p")}>Body Text (p)</p>
                        <Badge variant="outline">{Math.round(scale.p)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <small style={getBodyStyle("small")}>Small Text</small>
                        <Badge variant="outline">{Math.round(scale.small)}px</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={getBodyStyle("smaller")}>Smaller Text</span>
                        <Badge variant="outline">{Math.round(scale.smaller)}px</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-6">
                    <h3 style={getHeadingStyle("h3")} className="mb-4">
                      Sample Content
                    </h3>
                    <h1 style={getHeadingStyle("h1")}>Typography Matters</h1>
                    <p style={getBodyStyle("p")}>
                      Good typography is invisible. It enhances readability, establishes hierarchy, and creates a
                      consistent visual language. When done right, users focus on your message, not the fonts you've
                      chosen.
                    </p>
                    <h2 style={getHeadingStyle("h2")}>The Science Behind Fonts</h2>
                    <p style={getBodyStyle("p")}>
                      Different fonts evoke different emotional responses. Serif fonts like Times New Roman are often
                      perceived as traditional and authoritative, while sans-serif fonts like Helvetica are seen as
                      modern and clean.
                    </p>
                    <h3 style={getHeadingStyle("h3")}>Key Elements of Readable Typography</h3>
                    <p style={getBodyStyle("p")}>
                      Several factors contribute to the readability of your text, including font size, line height, line
                      length, and letter spacing.
                    </p>
                    <small style={getBodyStyle("small")}>
                      Note: The ideal font size depends on the specific font and the context in which it's used.
                    </small>
                  </div>
                </CardContent>
              </Card>

              {/* Code Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Example</CardTitle>
                  <CardDescription>Use this CSS to implement your typography scale in your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg bg-muted p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => copyToClipboard(typographyCSS)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copy code</span>
                    </Button>
                    <pre className="overflow-x-auto text-sm">
                      <code>{typographyCSS}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content for each section tab */}
            {docSections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: section.color }}
                  >
                    <div className="text-white">{section.icon}</div>
                  </div>
                  <div>
                    <h1 style={{ ...getHeadingStyle("h1"), margin: 0 }}>{section.title}</h1>
                    <p style={{ ...getBodyStyle("p"), margin: 0 }}>{section.description}</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {section.topics.map((topic, index) => (
                    <AccordionItem key={topic.id} value={topic.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span style={{ ...getHeadingStyle("h4"), margin: 0 }}>{topic.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-4">
                        <div className="space-y-4">
                          <p style={getBodyStyle("p")}>
                            This is placeholder content for the {topic.title} topic in the {section.title} section. In a
                            real documentation, this would contain detailed information about this specific topic.
                          </p>

                          <div className="rounded-lg border p-4">
                            <h5 style={{ ...getHeadingStyle("h5"), margin: "0 0 0.5rem" }}>Example</h5>
                            <p style={getBodyStyle("p")}>
                              Here's an example of how to apply these concepts in your projects.
                            </p>
                            <div className="mt-4 rounded bg-muted p-3">
                              <code className="text-sm">// Example code for {topic.title}</code>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Learn More
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Examples
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* Related Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Related Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-muted p-2">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 style={{ ...getHeadingStyle("h5"), margin: "0 0 0.25rem" }}>Typography Fundamentals</h4>
                            <p style={{ ...getBodyStyle("small"), margin: 0 }}>
                              Learn the basics of typography and type design
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-muted p-2">
                            <Code className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 style={{ ...getHeadingStyle("h5"), margin: "0 0 0.25rem" }}>Code Examples</h4>
                            <p style={{ ...getBodyStyle("small"), margin: 0 }}>
                              Implementation examples for various frameworks
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Responsive Design Section */}
      <section className="border-t bg-muted/50 py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 style={{ ...getHeadingStyle("h2"), margin: "0 0 1rem" }}>Responsive Typography</h2>
            <p style={{ ...getBodyStyle("p"), marginBottom: "2rem" }}>
              NexScale helps you create typography that looks great on any device
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 style={{ ...getHeadingStyle("h4"), margin: "0 0 0.5rem" }}>Mobile</h3>
                <p style={{ ...getBodyStyle("small"), maxWidth: "200px" }}>
                  Optimized for small screens and touch interfaces
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Tablet className="h-8 w-8 text-primary" />
                </div>
                <h3 style={{ ...getHeadingStyle("h4"), margin: "0 0 0.5rem" }}>Tablet</h3>
                <p style={{ ...getBodyStyle("small"), maxWidth: "200px" }}>
                  Perfect for medium-sized screens and reading
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
                <h3 style={{ ...getHeadingStyle("h4"), margin: "0 0 0.5rem" }}>Desktop</h3>
                <p style={{ ...getBodyStyle("small"), maxWidth: "200px" }}>
                  Designed for large screens and detailed content
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 style={{ ...getHeadingStyle("h2"), margin: "0 0 1rem", color: "white" }}>
              Ready to improve your typography?
            </h2>
            <p style={{ ...getBodyStyle("p"), marginBottom: "2rem", color: "rgba(255,255,255,0.9)" }}>
              Start creating beautiful, harmonious typography with NexScale today
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                Download Guide
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Image
                    src="/nexscale-logo.svg"
                    alt="NexScale Logo"
                    width={100}
                    height={30}
                    className={theme === "dark" ? "invert" : ""}
                  />
                </div>
                <p style={{ ...getBodyStyle("small"), marginBottom: "1rem" }}>
                  A tool for designers and developers to create beautiful, harmonious typography
                </p>
                <div className="flex gap-4">
                  {["Twitter", "GitHub", "Discord"].map((social) => (
                    <Button key={social} variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">{social}</span>
                      {social === "GitHub" ? <Github className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ ...getHeadingStyle("h5"), marginBottom: "1rem" }}>Documentation</h3>
                <ul className="space-y-2">
                  {["Getting Started", "Core Concepts", "Typography Tools", "Design Principles"].map((item) => (
                    <li key={item}>
                      <Button variant="link" className="h-auto p-0 text-muted-foreground">
                        {item}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ ...getHeadingStyle("h5"), marginBottom: "1rem" }}>Resources</h3>
                <ul className="space-y-2">
                  {["Blog", "Tutorials", "Examples", "Community"].map((item) => (
                    <li key={item}>
                      <Button variant="link" className="h-auto p-0 text-muted-foreground">
                        {item}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ ...getHeadingStyle("h5"), marginBottom: "1rem" }}>Legal</h3>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((item) => (
                    <li key={item}>
                      <Button variant="link" className="h-auto p-0 text-muted-foreground">
                        {item}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
              <p style={{ ...getBodyStyle("smaller"), opacity: 0.7 }}>
                © {new Date().getFullYear()} NexScale. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span style={{ ...getBodyStyle("smaller"), opacity: 0.7 }}>Made with</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span style={{ ...getBodyStyle("smaller"), opacity: 0.7 }}>by the NexScale team</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
