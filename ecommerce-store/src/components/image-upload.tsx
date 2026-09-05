"use client";

import { useState } from "react";

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

export function ImageUpload({ label, value, onChange, hint }: ImageUploadProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: data });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error || "Upload failed.");
      return;
    }
    onChange(payload.url);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#3d3831]">{label}</label>
      {hint ? <p className="text-xs text-[#8a7d6e]">{hint}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full bg-[#1c1915] px-4 py-2 text-sm text-white">
          {busy ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>
        <input
          className="min-w-[220px] flex-1 rounded-xl border border-[#d8cbbb] bg-white px-3 py-2 text-sm"
          placeholder="Or paste an image URL"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-28 w-28 rounded-xl object-cover" />
      ) : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
