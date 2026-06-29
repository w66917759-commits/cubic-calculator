import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "cubiccalculator@contact.com";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How Cubic Calculator handles calculator inputs, analytics, support messages, and privacy choices.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="utility-page">
      <section className="utility-card legal-copy">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy Policy for Cubic Calculator</h1>
        <p>
          Effective date: June 28, 2026. Cubic Calculator is designed to work without requiring an account.
          The dimensions and values you enter are used to calculate estimates and display results.
        </p>
        <h2>Information we collect</h2>
        <p>
          We may receive information you choose to send by email, such as feedback, correction requests,
          screenshots, or calculator examples. We may also receive standard technical information from hosting,
          analytics, or security tools, such as device type, browser, approximate region, referring page,
          pages visited, and error data.
        </p>
        <h2>Calculator inputs</h2>
        <p>
          The site does not require you to create an account or submit personal profile information to use the
          calculator. Dimension values, units, material selections, and project settings are used to generate
          estimates. If a feature stores settings locally, that storage is intended to keep the calculator
          usable in your browser.
        </p>
        <h2>How information is used</h2>
        <p>
          Information may be used to maintain the service, diagnose errors, understand aggregate usage, prevent
          abuse, respond to messages, and improve calculator content. We do not sell personal information.
        </p>
        <h2>Cookies and analytics</h2>
        <p>
          Cubic Calculator may use cookies, local storage, analytics scripts, or similar technologies to keep
          the site working, understand aggregate traffic patterns, and improve page performance. You can
          control many of these technologies through your browser settings.
        </p>
        <h2>Sharing information</h2>
        <p>
          We may share limited information with service providers that help host, secure, analyze, or maintain
          the site. We may also disclose information if required by law or to protect the site, users, or
          others from misuse.
        </p>
        <h2>Data retention</h2>
        <p>
          Technical logs, analytics records, and support messages are kept only as long as reasonably needed
          for operation, troubleshooting, security, and site improvement, unless a longer period is required by
          law.
        </p>
        <h2>Privacy for children</h2>
        <p>
          Cubic Calculator is a general-purpose calculation tool and is not directed to children. We do not
          knowingly collect personal information from children.
        </p>
        <h2>Your choices</h2>
        <p>
          You can avoid sending personal information by not emailing us, and you can limit cookies or local
          storage through your browser. If you contact us and want a message reviewed or deleted, email the
          address below with enough detail to identify the request.
        </p>
        <h2>Changes to this policy</h2>
        <p>
          We may update this Privacy Policy when the site, features, or service providers change. The updated
          version will be posted on this page with a new effective date.
        </p>
        <h2>Contact</h2>
        <p>
          Privacy questions can be sent to{" "}
          <a href={`mailto:${contactEmail}`} className="text-link">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
