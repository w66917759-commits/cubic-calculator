import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "cubiccalculator@contact.com";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Contact Cubic Calculator for feedback, correction requests, and calculator suggestions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="utility-page">
      <section className="utility-card legal-copy">
        <p className="eyebrow">Contact</p>
        <h1>Contact Cubic Calculator</h1>
        <p>
          Cubic Calculator is built for practical volume estimates across rooms, concrete, tanks, soil,
          shipping cargo, and mixed-shape projects. If you notice an issue or want to suggest an
          improvement, email us at{" "}
          <a href={`mailto:${contactEmail}`} className="text-link">
            {contactEmail}
          </a>
          .
        </p>
        <h2>What to send</h2>
        <p>
          For calculator corrections, include the page you were using, the shape selected, the dimensions
          entered, the units chosen, and the result you expected. Screenshots or copied result summaries are
          also useful because they make issues faster to reproduce.
        </p>
        <h2>Useful feedback</h2>
        <p>
          We welcome bug reports, unclear wording reports, missing unit requests, and suggestions for new
          presets. Examples include additional construction materials, freight use cases, tank shapes,
          garden materials, or formulas that would make the result easier to verify.
        </p>
        <h2>Response expectations</h2>
        <p>
          We review messages related to site accuracy, usability, and calculator content. We cannot provide
          project-specific engineering, construction, logistics, or purchasing advice, so critical decisions
          should be checked with a qualified professional before use.
        </p>
      </section>
    </main>
  );
}
