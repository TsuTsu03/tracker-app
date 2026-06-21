import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Terms of Service — ${LEGAL.appName}`,
  description:
    "The terms governing your use of WealthFlow, under the laws of the Republic of the Philippines.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      intro={`These Terms of Service ("Terms") are a binding agreement between you and ${LEGAL.entity} ("${LEGAL.appName}", "we", "us") governing your access to and use of the WealthFlow application and website. By creating an account or using the service, you agree to these Terms.`}
    >
      <h2>1. Acceptance and electronic agreement</h2>
      <p>
        By ticking the agreement box at sign-up or by using WealthFlow, you accept
        these Terms and our{" "}
        <a href="/privacy">Privacy Policy</a>. Consistent with the Electronic
        Commerce Act of 2000 (Republic Act No. 8792), your electronic acceptance
        has the same legal effect as a handwritten signature. If you do not agree,
        do not use the service.
      </p>

      <h2>2. Who may use WealthFlow</h2>
      <p>
        WealthFlow is intended for financial advisors and insurance professionals
        who are at least 18 years old and able to enter into a binding contract.
        You are responsible for ensuring your own use complies with the rules of
        your insurance company, the Insurance Commission, and any licensing or
        regulatory obligations that apply to you.
      </p>

      <h2>3. Your account</h2>
      <ul>
        <li>Provide accurate registration information and keep it current.</li>
        <li>Keep your password and credentials confidential; you are responsible for activity under your account.</li>
        <li>Notify us promptly of any unauthorised use at <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree that you will not:</p>
      <ul>
        <li>Use the service for any unlawful purpose or in violation of the Data Privacy Act or other Philippine law.</li>
        <li>Upload personal data of clients or prospects without a lawful basis (such as their consent) to do so.</li>
        <li>Attempt to access another user&apos;s account or data, or circumvent the app&apos;s security or row-level access controls.</li>
        <li>Reverse-engineer, scrape, overload, or disrupt the service or its AI/search providers.</li>
        <li>Use the service to send spam or to harass, defraud, or mislead any person.</li>
      </ul>

      <h2>5. Your data and your responsibilities as a controller</h2>
      <p>
        You retain ownership of the data you input. You grant us a limited licence
        to host and process it solely to provide the service to you. Because the
        client and prospect data you enter belongs to other people, <strong>you act
        as the Personal Information Controller</strong> for that data and are
        responsible for collecting and using it lawfully. We act as your
        Personal Information Processor, as described in the{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>6. AI output is assistance, not professional advice</h2>
      <p>
        WealthFlow uses AI (Llama 3.3 via Groq) and web search (Tavily) to generate
        suggestions such as prospect research, summaries, coaching, and proposal
        figures. This output:
      </p>
      <ul>
        <li>
          may be <strong>inaccurate, incomplete, or out of date</strong>, and must
          be independently verified before you rely on or act on it;
        </li>
        <li>
          is <strong>not financial, insurance, legal, tax, or investment advice</strong>,
          and does not replace your own professional judgement or the suitability
          and disclosure obligations you owe your clients;
        </li>
        <li>
          including any premium, coverage, or &ldquo;recommended cover&rdquo;
          figure, is <strong>illustrative only</strong> and not a quotation,
          underwriting decision, or offer from any insurer.
        </li>
      </ul>
      <p>You are solely responsible for any advice you give to your clients.</p>

      <h2>7. Intellectual property</h2>
      <p>
        The WealthFlow application, including its software, design, and the{" "}
        {LEGAL.appName} name and branding, is owned by {LEGAL.entity} and protected
        under the Intellectual Property Code of the Philippines (Republic Act No.
        8293). Company names and product information shown in the app belong to
        their respective owners and are used for identification only; their
        appearance does not imply endorsement or affiliation.
      </p>

      <h2>8. Third-party services</h2>
      <p>
        The service depends on third parties (Supabase, Groq, Tavily, Google).
        Their availability and acts are outside our control, and your use of
        features that rely on them is subject to their terms.
      </p>

      <h2>9. Service availability</h2>
      <p>
        We provide the service on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis and may modify, suspend, or discontinue features at
        any time. We do not warrant that the service will be uninterrupted,
        error-free, or secure against every threat.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by Philippine law, {LEGAL.entity} shall not
        be liable for any indirect, incidental, special, or consequential damages,
        or for loss of profits, data, goodwill, or business, arising from your use
        of (or inability to use) the service or from reliance on AI output. Our
        total aggregate liability for any claim relating to the service shall not
        exceed the total amount you paid us for the service in the twelve (12)
        months before the event giving rise to the claim, or PHP 5,000, whichever
        is greater. Nothing in these Terms limits liability that cannot be excluded
        under Philippine law.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        You agree to indemnify and hold {LEGAL.entity} harmless from claims,
        losses, and expenses (including reasonable legal fees) arising from your
        breach of these Terms, your misuse of the service, or your unlawful
        processing of another person&apos;s personal data.
      </p>

      <h2>12. Suspension and termination</h2>
      <p>
        You may stop using the service and delete your account at any time. We may
        suspend or terminate your access if you breach these Terms, create legal or
        security risk, or misuse the service. On termination, the provisions that
        by their nature should survive (including Sections 5, 6, 7, 10, 11, and 13)
        will remain in effect.
      </p>

      <h2>13. Governing law and venue</h2>
      <p>
        These Terms are governed by the laws of the Republic of the Philippines.
        The parties shall first attempt to resolve any dispute amicably. Failing
        that, the dispute shall be submitted to the exclusive jurisdiction of the
        proper courts of {LEGAL.venueCity}, to the exclusion of all other venues.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may update these Terms. Material changes take effect when posted here
        with a new &ldquo;Last updated&rdquo; date; your continued use after that
        constitutes acceptance.
      </p>

      <h2>15. Contact</h2>
      <p>
        {LEGAL.entity}
        <br />
        {LEGAL.address}
        <br />
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
      </p>
    </LegalDoc>
  );
}
