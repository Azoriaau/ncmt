"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Quote form handled by Netlify Forms: Netlify detects the form in the
 * prerendered HTML via data-netlify/form-name and captures AJAX
 * submissions POSTed to "/". Submissions appear in the Netlify dashboard
 * and trigger the configured email notification. Only works on the
 * deployed Netlify site — locally the POST has nowhere to go.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const body = new URLSearchParams(
        new FormData(e.currentTarget) as unknown as Record<string, string>
      ).toString();
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-background border border-accent/40 p-8 text-center">
        <p className="text-xl font-medium mb-2">Thanks — got it.</p>
        <p className="text-muted">
          We&apos;ll come back to you with a straight answer and a fair price.
        </p>
      </div>
    );
  }

  return (
    <form
      name="quote"
      method="POST"
      data-netlify="true"
      netlify-honeypot="company"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input type="hidden" name="form-name" value="quote" />
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="w-full rounded-xl bg-background border border-white/10 px-4 py-3 placeholder:text-muted/60 focus:border-accent-bright focus:outline-none transition-colors"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full rounded-xl bg-background border border-white/10 px-4 py-3 placeholder:text-muted/60 focus:border-accent-bright focus:outline-none transition-colors"
      />
      {/* Honeypot — hidden from real users; Netlify discards submissions that fill it */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <textarea
        name="message"
        placeholder="What are you moving, from where to where?"
        rows={4}
        required
        className="w-full rounded-xl bg-background border border-white/10 px-4 py-3 placeholder:text-muted/60 focus:border-accent-bright focus:outline-none transition-colors resize-none"
      />
      {status === "error" && (
        <p className="text-red-400 text-sm">
          Something went wrong sending your message. Please call or email us
          directly.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-accent hover:bg-accent-dim disabled:opacity-60 transition-colors text-white font-medium rounded-xl py-3"
      >
        {status === "sending" ? "Sending…" : "Request a quote"}
      </button>
    </form>
  );
}
