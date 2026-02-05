"use client";

import { useState } from "react";

const FORMSUBMIT_EMAIL = "ericcapiz@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name =
      (
        form.querySelector('[name="name"]') as HTMLInputElement
      )?.value?.trim() ?? "";
    const email =
      (
        form.querySelector('[name="email"]') as HTMLInputElement
      )?.value?.trim() ?? "";
    const message =
      (
        form.querySelector('[name="message"]') as HTMLTextAreaElement
      )?.value?.trim() ?? "";

    setStatus("sending");
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _captcha: "false",
        }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 text-base sm:text-sm min-h-[44px] sm:min-h-0";

  return (
    <form
      onSubmit={handleSubmit}
      className="text-left max-w-lg mx-auto space-y-4 sm:space-y-5 w-full"
    >
      <label className="block">
        <span className="text-slate-400 text-sm block mb-1">Name</span>
        <input
          type="text"
          name="name"
          required
          className={inputClass}
          placeholder="Your name"
          disabled={status === "sending"}
        />
      </label>

      <label className="block">
        <span className="text-slate-400 text-sm block mb-1">Email</span>
        <input
          type="email"
          name="email"
          required
          className={inputClass}
          placeholder="you@example.com"
          disabled={status === "sending"}
        />
      </label>

      <label className="block">
        <span className="text-slate-400 text-sm block mb-1">Message</span>
        <textarea
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-y min-h-[100px]`}
          placeholder="Your message..."
          disabled={status === "sending"}
        />
      </label>

      {status === "success" && (
        <p className="text-emerald-400 text-sm">
          Thanks — your message was sent. I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-amber-400/90 text-sm">
          Something went wrong. Please try again or email{" "}
          <a
            href={`mailto:${FORMSUBMIT_EMAIL}`}
            className="underline hover:text-indigo-300"
          >
            {FORMSUBMIT_EMAIL}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-6 py-3 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/50 hover:text-indigo-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
