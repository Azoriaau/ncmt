"use client";

import { LeadForm } from "@azoria/lead-form";
import { services } from "./Services";
import NetlifyQuoteForm from "./NetlifyQuoteForm";

/**
 * Enquiries post to Azoria Leads via @azoria/lead-form.
 *
 * Both values are inlined into the client bundle at build time, so whichever
 * machine runs `next build` needs them – they are not read at runtime. Neither
 * is a secret: the ingest endpoint only accepts enquiries and can be rotated,
 * and a Turnstile site key is public by design.
 *
 * With the endpoint unset the form falls back to the previous Netlify Forms
 * quote form, so a build without it still has a working contact section.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const fieldClass =
  "w-full rounded-xl bg-background border border-white/10 px-4 py-3 focus:border-accent-bright focus:outline-none transition-colors";
const labelClass =
  "font-mono text-xs uppercase tracking-widest text-muted";

export default function ContactForm() {
  if (!endpoint) return <NetlifyQuoteForm />;

  return (
    <LeadForm
      endpoint={endpoint}
      businessName="NCMT Transport"
      services={[...services.map((s) => s.title), "Something else"]}
      turnstileSiteKey={turnstileSiteKey}
      /* No `notice` override and no privacyPolicyUrl: the site has no privacy
         page, so the package's default notice names the overseas hosting
         countries inline instead of linking out — the disclosure still gets
         made. If a /privacy page is added later, pass privacyPolicyUrl and
         render privacyPolicyClause() there (see @azoria/lead-form README). */
      labels={{
        name: "Name",
        phone: "Phone",
        email: "Email",
        service: "Service",
        message: "What are you moving, from where to where?",
        submit: "Request a quote",
        submitting: "Sending…",
        successHeading: "Thanks — got it.",
        successBody:
          "We'll come back to you with a straight answer and a fair price.",
        errorGeneric:
          "Something went wrong sending your message. Please call or email us directly.",
        errorRequired:
          "Add your name, your message, and a phone number or email.",
      }}
      classNames={{
        form: "space-y-4",
        row: "grid gap-4 sm:grid-cols-2",
        label: labelClass,
        input: `mt-1.5 ${fieldClass}`,
        select: `mt-1.5 ${fieldClass}`,
        textarea: `mt-1.5 ${fieldClass} resize-none`,
        error: "text-red-400 text-sm",
        actions: "flex flex-wrap items-center gap-4",
        button:
          "flex-1 min-w-48 bg-accent hover:bg-accent-dim disabled:opacity-60 transition-colors text-white font-medium rounded-xl py-3 px-6",
        notice: "text-xs text-muted/80 text-center max-w-[52ch] mx-auto",
        noticeLink:
          "text-accent-bright underline underline-offset-2 hover:text-foreground transition-colors",
        success:
          "rounded-2xl bg-background border border-accent/40 p-8 text-center",
        successHeading: "text-xl font-medium mb-2",
        successBody: "text-muted",
      }}
    />
  );
}
