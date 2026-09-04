import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="h-screen overflow-y-auto bg-[#14231C] text-[#F1F5F0] font-sans scrollbar-gutter-stable">
      {/* Header */}
      <header className="border-b border-[#2E4A3A] bg-[#0F1D16]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-semibold text-lg tracking-tight text-[#F1F5F0] hover:text-[#D2A24C] transition-colors">
            <div className="w-7 h-7 bg-[#D2A24C] text-white rounded-md flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            AcadSync
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#9CB0A3] hover:text-[#D2A24C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Terms and Conditions
        </h1>
        <p className="text-sm text-[#6B8577] mb-10">
          Last Updated: September 3, 2026
        </p>

        {/* Sections */}
        <div className="space-y-10">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">1. Acceptance of Terms</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              By accessing and using AcadSync ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you may not use the Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">2. User Accounts</h2>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">2.1 Account Creation</h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Users must be at least 13 years old to create an account</li>
              <li>You can register using Google OAuth or email authentication</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials</li>
              <li>You agree to provide accurate and complete information during registration</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">2.2 Account Responsibility</h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>You are responsible for all activities that occur under your account</li>
              <li>You agree to notify us immediately of any unauthorized use of your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">3. Third-Party Integrations</h2>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">3.1 Google Calendar &amp; OAuth</h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>AcadSync integrates with Google Calendar and Google OAuth for authentication</li>
              <li>Your use of Google services is governed by Google's Terms of Service</li>
              <li>We access only the permissions you explicitly grant during OAuth login</li>
              <li>We are not responsible for Google's service availability or policy changes</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">3.2 Notion Integration</h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>AcadSync can sync with your Notion workspace</li>
              <li>Your use of Notion integrations is governed by Notion's Terms of Service</li>
              <li>We access only the permissions you explicitly grant</li>
              <li>We are not responsible for Notion's service availability or policy changes</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">4. Acceptable Use</h2>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">You agree NOT to use AcadSync for:</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Advertising or offering goods and services through the platform</li>
              <li>Illegal or unauthorized purposes</li>
              <li>Harassing, threatening, or defaming others</li>
              <li>Transmitting malware or harmful code</li>
              <li>Attempting to gain unauthorized access to the Service</li>
              <li>Disrupting the normal flow of the Service</li>
              <li>Selling, transferring, or trading your account</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">5. Intellectual Property</h2>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">5.1 Your Content</h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>You retain all rights to your calendar data and content</li>
              <li>AcadSync does not claim ownership of your data</li>
              <li>By using the Service, you grant us a license to process your data for the purpose of providing the Service</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">5.2 AcadSync Content</h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>All logos, visual design, text, graphics, and other content created by AcadSync are our exclusive property</li>
              <li>You may not reproduce, distribute, or modify AcadSync's content without permission</li>
              <li>You may use the Service only for personal, non-commercial purposes</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">6. Disclaimers</h2>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">6.1 "As Is" Service</h3>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">
              AcadSync is provided "AS IS" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of calendar syncing or data</li>
              <li>Data loss prevention</li>
              <li>Compatibility with all devices or browsers</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">6.2 No Liability for Third-Party Services</h3>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">We are not responsible for:</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Google Calendar or Google OAuth availability or functionality</li>
              <li>Notion's service availability or functionality</li>
              <li>Data loss or corruption caused by third-party services</li>
              <li>Actions or failures of third-party providers</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">6.3 User Data Responsibility</h3>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Backing up your calendar and data</li>
              <li>Reviewing synced data for accuracy</li>
              <li>Maintaining access to your Google and Notion accounts</li>
              <li>Complying with Google's and Notion's Terms of Service</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">7. Limitation of Liability</h2>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">
              To the maximum extent permitted by law, AcadSync and its creators shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of data, revenue, or profits</li>
              <li>Errors or omissions in the Service</li>
              <li>Interruptions or delays in service</li>
              <li>Third-party actions or services</li>
            </ul>
            <p className="text-[#9CB0A3] leading-relaxed mt-3">
              This applies even if we have been advised of the possibility of such damages.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">8. Privacy</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              Your use of AcadSync is also governed by our{' '}
              <Link
                to="/privacy"
                className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
              . Please review our Privacy Policy to understand our data collection and usage practices.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">9. Feedback and Suggestions</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              Any feedback, comments, or suggestions you provide about AcadSync may be used by us to improve the Service without compensation or credit to you.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">10. Modification of Terms</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the Service. Your continued use of AcadSync after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">11. Dispute Resolution</h2>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">11.1 Informal Negotiation</h3>
            <p className="text-[#9CB0A3] leading-relaxed">
              Before initiating arbitration, you and AcadSync agree to attempt to resolve any dispute through informal negotiations for a period of <strong className="text-[#F1F5F0]">30 days</strong>.
            </p>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">11.2 Arbitration</h3>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">
              If informal negotiation fails, any dispute shall be resolved through binding arbitration:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li><strong className="text-[#F1F5F0]">Location:</strong> Belagavi, India</li>
              <li><strong className="text-[#F1F5F0]">Language:</strong> English</li>
              <li><strong className="text-[#F1F5F0]">Arbitrator(s):</strong> One neutral arbitrator</li>
              <li><strong className="text-[#F1F5F0]">Governing Law:</strong> Indian law</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">11.3 Legal Venue</h3>
            <p className="text-[#9CB0A3] leading-relaxed">
              If arbitration is not applicable, disputes shall be subject to the exclusive jurisdiction of courts in Belagavi, India.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">12. Termination</h2>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">12.1 User Termination</h3>
            <p className="text-[#9CB0A3] leading-relaxed">
              You may terminate your account at any time by requesting deletion through the Service settings.
            </p>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">12.2 Our Termination</h3>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">
              We reserve the right to suspend or terminate your account and access to the Service at any time, with or without notice, for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Violation of these Terms and Conditions</li>
              <li>Unauthorized use of the Service</li>
              <li>Any conduct we determine to be harmful to the Service or other users</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-5 mb-2">12.3 Data Upon Termination</h3>
            <p className="text-[#9CB0A3] leading-relaxed mb-3">Upon account termination:</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1">
              <li>Your account data may be deleted</li>
              <li>You are responsible for backing up your data before termination</li>
              <li>We are not liable for data loss after account deletion</li>
            </ul>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">13. Contact Us</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              If you have questions about these Terms and Conditions, you can contact us:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#9CB0A3] leading-relaxed ml-1 mt-3">
              <li>
                <strong className="text-[#F1F5F0]">By Email:</strong>{' '}
                <a href="mailto:acharyaxdvay16@gmail.com" className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors">
                  acharyaxdvay16@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-[#F1F5F0]">By Visiting:</strong>{' '}
                <a href="https://acadsync1.vercel.app" className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors">
                  https://acadsync1.vercel.app
                </a>
              </li>
            </ul>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">14. Severability</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, that provision shall be removed and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">15. Entire Agreement</h2>
            <p className="text-[#9CB0A3] leading-relaxed">
              These Terms and Conditions, together with our{' '}
              <Link
                to="/privacy"
                className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
              , constitute the entire agreement between you and AcadSync regarding the use of the Service and supersede all prior agreements.
            </p>
          </section>

          {/* Acknowledgment */}
          <div className="border-t border-[#2E4A3A] pt-8 mt-10">
            <p className="text-[#F1F5F0] font-medium leading-relaxed">
              By using AcadSync, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2E4A3A] bg-[#0F1D16]/60">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#6B8577]">© {new Date().getFullYear()} AcadSync</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-[#6B8577] hover:text-[#D2A24C] transition-colors">
              Terms and Conditions
            </Link>
            <span className="text-[#2E4A3A]">·</span>
            <Link
              to="/privacy"
              className="text-xs text-[#6B8577] hover:text-[#D2A24C] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
