import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="h-screen overflow-y-auto bg-[#14231C] text-[#F1F5F0] font-sans scrollbar-gutter-stable">
      {/* Header */}
      <header className="border-b border-[#2E4A3A] bg-[#0F1D16]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold text-lg tracking-tight text-[#F1F5F0] hover:text-[#D2A24C] transition-colors"
          >
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
          Privacy Policy
        </h1>
        <p className="text-sm text-[#6B8577] mb-8">
          Last updated: September 03, 2026
        </p>

        <div className="space-y-8 text-[#9CB0A3] leading-relaxed">
          <p>
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p>
            We use Your Personal Data to provide and improve the Service. We collect, use, and disclose Your information as described in this Privacy Policy and, where required by applicable law, only where We have a valid legal basis to do so, including Your consent (where consent is required).
          </p>

          {/* Interpretation and Definitions */}
          <section className="pt-4 border-t border-[#2E4A3A]">
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-4 tracking-tight">
              Interpretation and Definitions
            </h2>
            <h3 className="text-base font-medium text-[#F1F5F0] mt-4 mb-2">Interpretation</h3>
            <p>
              The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-6 mb-3">Definitions</h3>
            <p className="mb-3">For the purposes of this Privacy Policy:</p>
            <ul className="list-disc list-inside space-y-2.5 ml-1">
              <li>
                <strong className="text-[#F1F5F0]">Account</strong> means a unique account created for You to access Our Service or parts of Our Service.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Privacy Policy) refers to acadsync1.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website, among its many uses.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Country/State</strong> refers to: Karnataka, India.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Device</strong> means any device that can access the Service, such as a computer, a cell phone or a digital tablet.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Personal Data</strong> (or &quot;Personal Information&quot;) is any information that relates to an identified or identifiable individual. We use &quot;Personal Data&quot; and &quot;Personal Information&quot; interchangeably unless a law uses a specific term.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Service</strong> refers to the Website.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
              </li>
              <li>
                <strong className="text-[#F1F5F0]">User</strong> means any individual who accesses or uses the Service.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Website</strong> refers to acadsync1, accessible from{' '}
                <a href="https://acadsync1.vercel.app" className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors">
                  https://acadsync1.vercel.app
                </a>.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
              </li>
            </ul>
          </section>

          {/* Collecting and Using Your Personal Information */}
          <section className="pt-6 border-t border-[#2E4A3A]">
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-4 tracking-tight">
              Collecting and Using Your Personal Information
            </h2>
            <h3 className="text-base font-medium text-[#F1F5F0] mt-4 mb-2">Types of Data Collected</h3>

            <h4 className="text-sm font-semibold text-[#F1F5F0] mt-4 mb-2">Personal Data</h4>
            <p className="mb-2">
              While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-1 mb-4">
              <li>Email address</li>
              <li>First name and last name</li>
            </ul>

            <h4 className="text-sm font-semibold text-[#F1F5F0] mt-4 mb-2">Usage Data</h4>
            <p className="mb-3">
              Usage Data is collected automatically when using the Service.
            </p>
            <p className="mb-3">
              Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of Our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            <p className="mb-3">
              When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device's unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
            </p>
            <p className="mb-4">
              We may also collect information that Your browser sends whenever You visit Our Service or when You access the Service by or through a mobile device.
            </p>

            <h4 className="text-sm font-semibold text-[#F1F5F0] mt-4 mb-2">Tracking Technologies and Cookies</h4>
            <p className="mb-3">
              We use tracking technologies (such as cookies) to track the activity and to improve Our Service. The technologies We use may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-1 mb-4">
              <li>
                <strong className="text-[#F1F5F0]">Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of Our Service.
              </li>
              <li>
                <strong className="text-[#F1F5F0]">Web Beacons.</strong> Certain sections of Our Service may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages and for other related website statistics.
              </li>
            </ul>
            <p className="mb-3">
              Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.
            </p>
            <p className="mb-4">
              We use both Session and Persistent Cookies for the purposes set out below:
            </p>
            <div className="space-y-4 mb-4">
              <div className="p-4 rounded-md bg-[#1F3329]/60 border border-[#2E4A3A]">
                <h5 className="text-sm font-semibold text-[#F1F5F0] mb-1">Necessary / Essential Cookies</h5>
                <p className="text-xs text-[#6B8577] mb-2">Type: Session Cookies | Administered by: Us</p>
                <p className="text-xs">
                  These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts.
                </p>
              </div>
              <div className="p-4 rounded-md bg-[#1F3329]/60 border border-[#2E4A3A]">
                <h5 className="text-sm font-semibold text-[#F1F5F0] mb-1">Cookies Policy / Notice Acceptance Cookies</h5>
                <p className="text-xs text-[#6B8577] mb-2">Type: Persistent Cookies | Administered by: Us</p>
                <p className="text-xs">
                  These Cookies identify whether users have accepted the use of cookies on the Website and record the consent choices You have made.
                </p>
              </div>
              <div className="p-4 rounded-md bg-[#1F3329]/60 border border-[#2E4A3A]">
                <h5 className="text-sm font-semibold text-[#F1F5F0] mb-1">Functionality Cookies</h5>
                <p className="text-xs text-[#6B8577] mb-2">Type: Persistent Cookies | Administered by: Us</p>
                <p className="text-xs">
                  These Cookies allow Us to remember choices You make when You use the Website, such as remembering Your Account login details or language preference.
                </p>
              </div>
            </div>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-6 mb-2">Use of Your Personal Data</h3>
            <p className="mb-3">The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-1 mb-4">
              <li><strong className="text-[#F1F5F0]">To provide and maintain Our Service</strong>, including to monitor the usage of Our Service.</li>
              <li><strong className="text-[#F1F5F0]">To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
              <li><strong className="text-[#F1F5F0]">For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for products or services You have purchased.</li>
              <li><strong className="text-[#F1F5F0]">To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
              <li><strong className="text-[#F1F5F0]">To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer.</li>
              <li><strong className="text-[#F1F5F0]">To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              <li><strong className="text-[#F1F5F0]">For business transfers:</strong> We may use Your Personal Data to evaluate or conduct a merger, divestiture, or transfer of assets.</li>
              <li><strong className="text-[#F1F5F0]">For other purposes:</strong> such as data analysis, identifying usage trends, and evaluating and improving Our Service and experience.</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-6 mb-2">Retention of Your Personal Data</h3>
            <p className="mb-3">
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with Our legal obligations, resolve disputes, and enforce Our legal agreements and policies.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-1 mb-4">
              <li><strong className="text-[#F1F5F0]">User Accounts:</strong> retained for the duration of Your Account relationship plus up to 24 months after account closure.</li>
              <li><strong className="text-[#F1F5F0]">Customer Support Data:</strong> up to 24 months from the date of ticket closure.</li>
              <li><strong className="text-[#F1F5F0]">Usage &amp; Analytics Data:</strong> up to 24 months from the date of collection.</li>
            </ul>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-6 mb-2">Transfer of Your Personal Data</h3>
            <p className="mb-4">
              Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy.
            </p>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-6 mb-2">Delete Your Personal Data</h3>
            <p className="mb-4">
              You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. You may update, amend, or delete Your information at any time by signing in to Your Account or contacting Us.
            </p>

            <h3 className="text-base font-medium text-[#F1F5F0] mt-6 mb-2">Security of Your Personal Data</h3>
            <p className="mb-4">
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="pt-6 border-t border-[#2E4A3A]">
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">
              Children's and Minors' Privacy
            </h2>
            <p>
              The Service is not directed to, and We do not knowingly collect Personal Information from, anyone under the age of 16. If You are a parent or guardian and You believe Your child has provided Us with Personal Information, please contact Us.
            </p>
          </section>

          {/* Links to Other Websites */}
          <section className="pt-6 border-t border-[#2E4A3A]">
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">
              Links to Other Websites
            </h2>
            <p>
              Our Service may contain links to other websites that are not operated by Us. If You click on a third-party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.
            </p>
          </section>

          {/* Changes to this Privacy Policy */}
          <section className="pt-6 border-t border-[#2E4A3A]">
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">
              Changes to this Privacy Policy
            </h2>
            <p>
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="pt-6 border-t border-[#2E4A3A]">
            <h2 className="text-xl font-semibold text-[#F1F5F0] mb-3 tracking-tight">
              Contact Us
            </h2>
            <p className="mb-3">
              If You have any questions about this Privacy Policy, You can contact Us:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>
                <strong className="text-[#F1F5F0]">By Email:</strong>{' '}
                <a
                  href="mailto:acharyaxdvay16@gmail.com"
                  className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors"
                >
                  acharyaxdvay16@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-[#F1F5F0]">By Visiting:</strong>{' '}
                <a
                  href="https://acadsync1.vercel.app"
                  className="text-[#D2A24C] hover:text-[#B98A3C] underline underline-offset-2 transition-colors"
                >
                  https://acadsync1.vercel.app
                </a>
              </li>
            </ul>
          </section>
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
            <Link to="/privacy" className="text-xs text-[#6B8577] hover:text-[#D2A24C] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
