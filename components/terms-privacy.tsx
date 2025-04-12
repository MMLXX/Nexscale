"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export function TermsPrivacy() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(pathname === "/privacy" ? "privacy" : "terms")

  useEffect(() => {
    setActiveTab(pathname === "/privacy" ? "privacy" : "terms")
  }, [pathname])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Image src="/nexscale-logo.svg" alt="NexScale Logo" width={120} height={35} className="dark:invert" />
        </Link>
        <p className="text-sm text-muted-foreground">A Typescale Calculator by NEXOR</p>
      </div>

      <h1 className="text-3xl font-bold mb-8">Legal Information</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-2xl font-semibold">Terms of Service</h2>
              <p className="text-sm text-muted-foreground">Last updated: March 22, 2025</p>

              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-medium">1. Introduction</h3>
                  <p>
                    Welcome to NexScale ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of
                    Service") govern your use of our website located at nexoragency.com (together or individually
                    "Service") operated by NexScale.
                  </p>
                  <p>
                    Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and
                    disclose information that results from your use of our web pages.
                  </p>
                  <p>
                    Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge
                    that you have read and understood Agreements, and agree to be bound of them.
                  </p>
                  <p>
                    If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but
                    please let us know by emailing at hello@nexoragency.com so we can try to find a solution. These
                    Terms apply to all visitors, users and others who wish to access or use Service.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">2. Communications</h3>
                  <p>
                    By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and
                    other information we may send. However, you may opt out of receiving any, or all, of these
                    communications from us by following the unsubscribe link or by emailing at hello@nexoragency.com.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">3. Purchases</h3>
                  <p>
                    If you wish to purchase any product or service made available through Service ("Purchase"), you may
                    be asked to supply certain information relevant to your Purchase including but not limited to, your
                    credit or debit card number, the expiration date of your card, your billing address, and your
                    shipping information.
                  </p>
                  <p>
                    You represent and warrant that: (i) you have the legal right to use any card(s) or other payment
                    method(s) in connection with any Purchase; and that (ii) the information you supply to us is true,
                    correct and complete.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">4. Content</h3>
                  <p>
                    Our Service allows you to post, link, store, share and otherwise make available certain information,
                    text, graphics, videos, or other material ("Content"). You are responsible for Content that you post
                    on or through Service, including its legality, reliability, and appropriateness.
                  </p>
                  <p>
                    By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you
                    own it) and/or you have the right to use it and the right to grant us the rights and license as
                    provided in these Terms, and (ii) that the posting of your Content on or through Service does not
                    violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any
                    person or entity.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">5. GDPR Compliance</h3>
                  <p>
                    For users in the European Union (EU), we comply with the General Data Protection Regulation (GDPR).
                    This means:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>We will only collect and process your data when we have a legal basis to do so</li>
                    <li>We will inform you about how we use your data</li>
                    <li>We will ensure that we only collect the minimum data necessary for the purpose</li>
                    <li>We will ensure your data is accurate and up to date</li>
                    <li>We will implement appropriate security measures to protect your data</li>
                    <li>
                      We will respect your rights as a data subject, including the right to access, correct, delete,
                      restrict processing, and port your data
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">6. CCPA Compliance</h3>
                  <p>
                    For California residents, we comply with the California Consumer Privacy Act (CCPA). Under the CCPA,
                    you have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Know what personal information is being collected about you</li>
                    <li>Know whether your personal information is sold or disclosed and to whom</li>
                    <li>Say no to the sale of personal information</li>
                    <li>Access your personal information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Not be discriminated against for exercising your privacy rights</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">7. International Data Transfers</h3>
                  <p>
                    Your information may be transferred to — and maintained on — computers located outside of your
                    state, province, country or other governmental jurisdiction where the data protection laws may
                    differ from those in your jurisdiction.
                  </p>
                  <p>
                    If you are located outside the United States and choose to provide information to us, please note
                    that we transfer the information, including personal information, to the United States and process
                    it there.
                  </p>
                  <p>
                    Your consent to this Privacy Policy followed by your submission of such information represents your
                    agreement to that transfer.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">8. Limitation of Liability</h3>
                  <p>
                    In no event shall NexScale, nor its directors, employees, partners, agents, suppliers, or
                    affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                    including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                    resulting from your access to or use of or inability to access or use the Service.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">9. Governing Law</h3>
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which
                    you reside, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of
                    those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the
                    remaining provisions of these Terms will remain in effect.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">10. Contact Us</h3>
                  <p>If you have any questions about these Terms, please contact us at hello@nexoragency.com.</p>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-2xl font-semibold">Privacy Policy</h2>
              <p className="text-sm text-muted-foreground">Last updated: March 22, 2025</p>

              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-medium">1. Introduction</h3>
                  <p>
                    Welcome to NexScale's Privacy Policy. This Privacy Policy describes how we collect, use, process,
                    and disclose your information, including personal information, in conjunction with your access to
                    and use of NexScale.
                  </p>
                  <p>
                    When this policy mentions "NexScale," "we," "us," or "our," it refers to NexScale, which is
                    responsible for your information under this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">2. Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us, such as when you create or modify your account,
                    request customer support, or otherwise communicate with us. This information may include: name,
                    email, password, and other information you choose to provide.
                  </p>
                  <p>
                    We automatically collect information about you and your device when you use our Service, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Log Information: We collect log information when you use our Service, including access times,
                      pages viewed, IP address, and the page you visited before navigating to our Service.
                    </li>
                    <li>
                      Device Information: We collect information about the device you use to access our Service,
                      including hardware model, operating system and version, unique device identifiers, and mobile
                      network information.
                    </li>
                    <li>
                      Usage Information: We collect information about your use of our Service, such as the features you
                      use, the actions you take, and the time, frequency, and duration of your activities.
                    </li>
                    <li>
                      Cookies and Similar Technologies: We use cookies and similar technologies to collect information
                      about your browsing behavior and preferences.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">3. Legal Basis for Processing (EU Users)</h3>
                  <p>
                    If you are in the European Union, we collect and process information about you only where we have
                    legal bases for doing so under applicable EU laws. The legal bases depend on the Services you use
                    and how you use them. This means we collect and use your information only where:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      We need it to provide you the Services, including to operate the Services, provide customer
                      support and personalized features, and to protect the safety and security of the Services;
                    </li>
                    <li>
                      It satisfies a legitimate interest (which is not overridden by your data protection interests),
                      such as for research and development, to market and promote the Services, and to protect our legal
                      rights and interests;
                    </li>
                    <li>You give us consent to do so for a specific purpose; or</li>
                    <li>We need to process your data to comply with a legal obligation.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">4. How We Use Information</h3>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide, maintain, and improve our Service;</li>
                    <li>Process transactions and send related information, including confirmations and invoices;</li>
                    <li>Send technical notices, updates, security alerts, and support and administrative messages;</li>
                    <li>Respond to your comments, questions, and requests, and provide customer service;</li>
                    <li>
                      Communicate with you about products, services, offers, promotions, and events, and provide other
                      news or information about us;
                    </li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our Service;</li>
                    <li>
                      Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect
                      the rights and property of NexScale and others;
                    </li>
                    <li>
                      Personalize and improve the Service and provide content or features that match user profiles or
                      interests.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">5. Sharing of Information</h3>
                  <p>We may share the information we collect as follows:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      With vendors, consultants, and other service providers who need access to such information to
                      carry out work on our behalf;
                    </li>
                    <li>
                      In response to a request for information if we believe disclosure is in accordance with, or
                      required by, any applicable law, regulation, or legal process;
                    </li>
                    <li>
                      If we believe your actions are inconsistent with our user agreements or policies, or to protect
                      the rights, property, and safety of NexScale or others;
                    </li>
                    <li>
                      In connection with, or during negotiations of, any merger, sale of company assets, financing, or
                      acquisition of all or a portion of our business by another company;
                    </li>
                    <li>
                      Between and among NexScale and our current and future parents, affiliates, subsidiaries, and other
                      companies under common control and ownership;
                    </li>
                    <li>With your consent or at your direction.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">6. Your Rights and Choices</h3>
                  <p>
                    <strong>European Economic Area (EEA) Residents:</strong> If you are in the EEA, you have the
                    following rights in relation to your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access: You can request a copy of the personal information we hold about you.</li>
                    <li>Rectification: You can ask us to correct inaccurate or incomplete information.</li>
                    <li>Erasure: You can ask us to erase your personal information in certain circumstances.</li>
                    <li>
                      Restriction: You can ask us to restrict the processing of your information in certain
                      circumstances.
                    </li>
                    <li>
                      Data Portability: You can ask us to transfer your information to another organization or to you in
                      certain circumstances.
                    </li>
                    <li>
                      Objection: You can object to our processing of your personal information in certain circumstances.
                    </li>
                    <li>
                      Withdraw Consent: If we rely on your consent to process your information, you can withdraw that
                      consent at any time.
                    </li>
                  </ul>

                  <p className="mt-4">
                    <strong>California Residents:</strong> If you are a California resident, the CCPA provides you with
                    specific rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Right to Know: You can request information about the personal information we have collected about
                      you and how we have used and shared it.
                    </li>
                    <li>
                      Right to Delete: You can request that we delete the personal information we have collected from
                      you.
                    </li>
                    <li>Right to Opt-Out: You can opt-out of the sale of your personal information.</li>
                    <li>
                      Right to Non-Discrimination: We will not discriminate against you for exercising any of your CCPA
                      rights.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">7. Data Retention</h3>
                  <p>
                    We retain your personal information for as long as necessary to provide the services you have
                    requested, or for other essential purposes such as complying with our legal obligations, resolving
                    disputes, and enforcing our policies.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">8. International Data Transfers</h3>
                  <p>
                    We may transfer your personal information to countries other than the one in which you live. We
                    deploy the following safeguards if we transfer personal information originating from the European
                    Union or Switzerland to other countries not deemed adequate under applicable data protection law:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>EU-U.S. Privacy Shield Framework and the Swiss-U.S. Privacy Shield Framework</li>
                    <li>European Commission approved standard contractual clauses</li>
                    <li>Binding corporate rules for transfers to data processors</li>
                    <li>Binding corporate rules for transfers to data controllers</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-medium">9. Children's Privacy</h3>
                  <p>
                    Our Service is not directed to children under the age of 16, and we do not knowingly collect
                    personal information from children under 16. If we learn that we have collected personal information
                    of a child under 16, we will take steps to delete such information from our files as soon as
                    possible.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">10. Changes to This Privacy Policy</h3>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                    the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy
                    Policy.
                  </p>
                  <p>
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                    Policy are effective when they are posted on this page.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-medium">11. Contact Us</h3>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at hello@nexoragency.com.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="mt-16 pt-6 border-t text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-between items-center">
          <div>© NexScale</div>
          <div className="flex gap-4">
            <a href="mailto:hello@nexoragency.com" className="hover:underline">
              Contact
            </a>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
