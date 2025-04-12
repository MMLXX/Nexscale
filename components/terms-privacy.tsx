"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function TermsPrivacy() {
  const { theme } = useTheme()
  const isPrivacy = typeof window !== "undefined" && window.location.pathname.includes("privacy")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/nexscale-logo.svg"
              alt="NexScale Logo"
              width={100}
              height={30}
              className={theme === "dark" ? "invert" : ""}
            />
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 md:p-8 lg:p-10">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto mb-4" asChild>
            <Link href="/">
              <ChevronLeft className="h-3 w-3" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-6">{isPrivacy ? "Privacy Policy" : "Terms of Service"}</h1>
          <p className="text-muted-foreground text-sm">Last updated: April 11, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {isPrivacy ? (
            <>
              <p>
                At NexScale, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you visit our website or use our typography scale calculator.
              </p>

              <h2>Information We Collect</h2>
              <p>We collect information that you voluntarily provide to us when you use our services, such as:</p>
              <ul>
                <li>Email address (if you subscribe to our newsletter)</li>
                <li>Usage data (how you interact with our application)</li>
                <li>Device information (browser type, operating system, etc.)</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including:</p>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>

              <h2>Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain
                information. Cookies are files with a small amount of data which may include an anonymous unique
                identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our service.
              </p>

              <h2>Data Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the
                Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your personal data, we cannot guarantee its absolute security.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>

              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@nexscale.io.</p>
            </>
          ) : (
            <>
              <p>
                Please read these Terms of Service carefully before using the NexScale website and typography scale
                calculator.
              </p>

              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part
                of the terms, then you may not access the service.
              </p>

              <h2>2. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are and will remain the exclusive
                property of NexScale and its licensors. The service is protected by copyright, trademark, and other laws
                of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the
                prior written consent of NexScale.
              </p>

              <h2>3. User Content</h2>
              <p>
                When you create typography scales using our service, you retain all rights to your content. However, by
                creating and saving typography scales, you grant us a license to use, modify, publicly perform, publicly
                display, reproduce, and distribute such content on and through the service.
              </p>

              <h2>4. Termination</h2>
              <p>
                We may terminate or suspend your access to our service immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination,
                including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
                liability.
              </p>

              <h2>5. Limitation of Liability</h2>
              <p>
                In no event shall NexScale, nor its directors, employees, partners, agents, suppliers, or affiliates, be
                liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the service.
              </p>

              <h2>6. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days notice prior to any new terms taking
                effect.
              </p>
              <p>
                By continuing to access or use our service after those revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, please stop using the service.
              </p>

              <h2>7. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at terms@nexscale.io.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
