"use client";

import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      let payload: { error?: string } = {};
      try {
        payload = await response.json();
      } catch {
        payload = { error: "Login failed. Check MongoDB and try again." };
      }

      if (!response.ok) {
        setError(payload.error || "Could not sign in.");
        setBusy(false);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1c1915] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-[#f6f1ea] p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Staff access</p>
        <h1 className="mt-2 font-serif text-4xl">Dashboard login</h1>
        <p className="mt-3 text-sm text-[#5d5348]">
          Email <strong>admin@lumen.store</strong>
          <br />
          Password <strong>Admin123!</strong>
        </p>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue="admin@lumen.store"
          className="mt-8 w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue="Admin123!"
          className="mt-3 w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-[#1c1915] py-3 text-sm text-white">
          {busy ? "Opening dashboard..." : "Sign in to dashboard"}
        </button>
      </form>
    </div>
  );
}
