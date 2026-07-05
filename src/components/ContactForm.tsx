"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus("sent");
      } else {
        setError(
          data?.message ??
            "Something went wrong sending your message. Please call or email us directly."
        );
        setStatus("error");
      }
    } catch {
      setError(
        "Something went wrong sending your message. Please call or email us directly."
      );
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="w-full rounded-xl bg-background border border-white/10 px-4 py-3 placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full rounded-xl bg-background border border-white/10 px-4 py-3 placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors"
      />
      {/* Honeypot — hidden from real users, bots fill it in */}
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
        className="w-full rounded-xl bg-background border border-white/10 px-4 py-3 placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors resize-none"
      />
      {status === "error" && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-accent hover:bg-accent-dim disabled:opacity-60 transition-colors text-background font-medium rounded-xl py-3"
      >
        {status === "sending" ? "Sending…" : "Request a quote"}
      </button>
    </form>
  );
}
