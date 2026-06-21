import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Privacy Policy — ${LEGAL.appName}`,
  description:
    "How WealthFlow collects, uses, and protects personal data under the Philippine Data Privacy Act of 2012 (RA 10173).",
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      intro={`${LEGAL.entity} ("${LEGAL.appName}", "we", "us") respects your right to privacy. This Policy explains how we collect, use, disclose, and protect personal data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing Rules and Regulations, and the issuances of the National Privacy Commission ("NPC").`}
    >
      <h2>1. Our two roles under the Data Privacy Act</h2>
      <p>
        WealthFlow processes two different categories of data, and our role
        differs for each:
      </p>
      <ul>
        <li>
          <strong>Your account data — we are the Personal Information
          Controller (PIC).</strong> When you register and use WealthFlow as a
          financial advisor, we determine how your account information is
          processed.
        </li>
        <li>
          <strong>Your clients&apos; and prospects&apos; data — we are a
          Personal Information Processor (PIP).</strong> Any lead, client,
          prospect, meeting note, or financial detail you enter about other
          people is processed by us <em>on your behalf and under your
          instructions</em>. For that data, <strong>you</strong> are the PIC and
          are responsible for having a lawful basis (e.g. consent) to collect and
          input it. We process it only to provide the service to you.
        </li>
      </ul>

      <h2>2. Personal data we collect</h2>
      <h3>From you (the advisor)</h3>
      <ul>
        <li>Identity &amp; contact: full name, email address, chosen insurance company.</li>
        <li>Authentication data: hashed password, or Google account identifier if you sign in with Google.</li>
        <li>Usage and technical data: log records, device/browser information, and IP address, processed by our infrastructure providers for security and reliability.</li>
        <li>Cookies strictly necessary to keep you signed in and to remember your selected company theme (see Section 8).</li>
      </ul>
      <h3>That you input about other people (clients/prospects)</h3>
      <ul>
        <li>Names, contact details, occupation, employer, location.</li>
        <li>Financial and household information you choose to record (e.g. income range, dependents, coverage needs, budget).</li>
        <li>Meeting notes, call transcripts, and pipeline activity you create.</li>
      </ul>
      <p>
        Some of this may constitute <strong>sensitive personal information</strong>{" "}
        under the Act (for example, information about health or financial
        condition). Only record what is necessary, and only where you have the
        data subject&apos;s consent or another lawful basis.
      </p>

      <h2>3. How and why we use personal data</h2>
      <ul>
        <li>To create and operate your account and authenticate you.</li>
        <li>To provide the CRM, pipeline, proposal, and AI assistant features you request.</li>
        <li>To generate AI output (lead research, summaries, coaching, proposals) from the data you submit.</li>
        <li>To secure the service, prevent abuse, and maintain audit/security logs.</li>
        <li>To comply with legal obligations and respond to lawful requests.</li>
      </ul>
      <p>
        Our lawful bases under Section 12–13 of the Act include your{" "}
        <strong>consent</strong>, the <strong>performance of our contract</strong>{" "}
        with you, our <strong>legitimate interests</strong> in running and
        securing the service, and <strong>compliance with law</strong>.
      </p>

      <h2>4. Third-party processors and disclosure</h2>
      <p>
        We do not sell personal data. We share it only with sub-processors that
        help us run the service, under confidentiality and data-protection
        obligations:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — database, authentication, and hosting of
          your records.
        </li>
        <li>
          <strong>Groq</strong> — runs the AI model (Llama 3.3) that processes
          the text you submit to AI features.
        </li>
        <li>
          <strong>Tavily</strong> — performs live web searches for the Lead
          Generator and Prospect Research features, using the search terms you
          provide.
        </li>
        <li>
          <strong>Google</strong> — only if you choose &ldquo;Continue with
          Google&rdquo; sign-in.
        </li>
      </ul>
      <p>
        Some of these providers process data on servers <strong>outside the
        Philippines</strong>. Where personal data is transferred abroad, we take
        steps consistent with the Act to ensure it remains protected, and we
        remain accountable for it. We may also disclose data when required by
        law, court order, or a lawful NPC request.
      </p>

      <h2>5. How we protect your data</h2>
      <ul>
        <li>
          <strong>Row-Level Security:</strong> every record is scoped to your
          account in the database, so one advisor can never read or modify
          another&apos;s data.
        </li>
        <li>Encryption of data in transit (HTTPS/TLS) and at rest by our hosting provider.</li>
        <li>Authentication required for all application and AI functions, with enforced security response headers.</li>
        <li>Access to production data is limited and logged.</li>
      </ul>

      <h2>6. Data retention</h2>
      <p>
        We keep your account data for as long as your account is active. Data you
        enter about clients/prospects is retained until you delete it or close
        your account. On account closure, we will delete or anonymise personal
        data within a reasonable period, unless a longer period is required by
        law (e.g. tax or insurance record-keeping rules).
      </p>

      <h2>7. Your rights as a data subject</h2>
      <p>Under the Data Privacy Act you have the right to:</p>
      <ul>
        <li><strong>Be informed</strong> about the processing of your personal data.</li>
        <li><strong>Access</strong> the personal data we hold about you.</li>
        <li><strong>Rectify</strong> inaccurate or outdated data.</li>
        <li><strong>Object</strong> to or withhold consent for processing.</li>
        <li><strong>Erasure or blocking</strong> of your data under the conditions set by the Act.</li>
        <li><strong>Data portability</strong> — obtain a copy of your data in an electronic format.</li>
        <li><strong>Damages</strong> for violations, and to <strong>lodge a complaint</strong> with the NPC.</li>
      </ul>
      <p>
        To exercise any of these, email{" "}
        <a href={`mailto:${LEGAL.dpoEmail}`}>{LEGAL.dpoEmail}</a>. We will respond
        within the timeframes required by the NPC. If your request concerns a
        client&apos;s data that another advisor entered, we will refer you to that
        advisor as the responsible Personal Information Controller.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use only <strong>strictly necessary cookies</strong>: a session cookie
        to keep you signed in, and a preference cookie that remembers your chosen
        company theme. We do not use advertising or third-party tracking cookies.
        If we add analytics in the future, we will request your consent first as
        required by the NPC.
      </p>

      <h2>9. Children</h2>
      <p>
        WealthFlow is a professional tool intended for licensed or affiliated
        financial advisors and is not directed to children. Do not record data
        about a minor without the consent of a parent or guardian as required by
        the Act.
      </p>

      <h2>10. Data breach</h2>
      <p>
        In the event of a personal data breach that meets the criteria under the
        Act and NPC Circular 16-03, we will notify the NPC and affected data
        subjects within the required period.
      </p>

      <h2>11. Changes to this Policy</h2>
      <p>
        We may update this Policy. Material changes will be posted here with a new
        &ldquo;Last updated&rdquo; date and, where appropriate, notified to you.
      </p>

      <h2>12. Contact us / Data Protection Officer</h2>
      <p>
        {LEGAL.entity}
        <br />
        {LEGAL.address}
        <br />
        Data Protection Officer: {LEGAL.dpoName} —{" "}
        <a href={`mailto:${LEGAL.dpoEmail}`}>{LEGAL.dpoEmail}</a>
        <br />
        General inquiries:{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
      </p>
      <p>
        You may also contact the National Privacy Commission at{" "}
        <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer">
          privacy.gov.ph
        </a>
        .
      </p>
    </LegalDoc>
  );
}
