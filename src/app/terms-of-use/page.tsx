import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "cubiccalculator@contact.com";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Use",
  description: "Terms for using Cubic Calculator volume, material, freight, and unit conversion estimates.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return (
    <main className="utility-page">
      <section className="utility-card legal-copy">
        <p className="eyebrow">Terms</p>
        <h1>Terms of Use for Cubic Calculator</h1>
        <p>
          Effective date: June 28, 2026. By using Cubic Calculator, you agree to these terms. If you do not
          agree, do not use the site.
        </p>
        <h2>Use of the site</h2>
        <p>
          Cubic Calculator provides browser-based tools for estimating cubic volume, material quantity,
          freight volume, and related measurement conversions. You may use the site for lawful personal,
          educational, and business planning purposes.
        </p>
        <h2>Estimates only</h2>
        <p>
          Calculator results depend on the dimensions, units, shapes, densities, waste factors, and assumptions
          entered by the user. Results are estimates and are not professional engineering, construction,
          logistics, or purchasing advice.
        </p>
        <h2>Your responsibility</h2>
        <p>
          You are responsible for checking all measurements, formulas, unit conversions, waste factors, prices,
          material requirements, and project assumptions before relying on a result. Critical projects should
          be reviewed by a qualified professional.
        </p>
        <h2>Prohibited use</h2>
        <p>
          You may not misuse the site, interfere with its operation, attempt unauthorized access, copy the site
          in a way that violates applicable law, or use calculator output as a substitute for required
          professional review, permits, inspections, or safety procedures.
        </p>
        <h2>Content and intellectual property</h2>
        <p>
          The site design, text, formulas, interface, and related content are provided for use with Cubic
          Calculator. You may link to public pages and use generated estimates for your own planning, but you
          may not reproduce or redistribute substantial portions of the site as a competing service without
          permission.
        </p>
        <h2>Third-party services</h2>
        <p>
          The site may rely on hosting, analytics, security, or other technical service providers. Those
          services may process limited technical data needed to operate and protect the site.
        </p>
        <h2>No warranty</h2>
        <p>
          The site is provided as available. We aim to keep calculations useful and accurate, but we do not
          guarantee uninterrupted availability or error-free results.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Cubic Calculator is not responsible for losses, costs,
          delays, over-ordering, under-ordering, project errors, or other damages that may result from use of
          the site or reliance on calculator estimates.
        </p>
        <h2>Changes to these terms</h2>
        <p>
          We may update these terms when the site, features, or operating requirements change. Continued use
          of Cubic Calculator after changes are posted means you accept the updated terms.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${contactEmail}`} className="text-link">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
