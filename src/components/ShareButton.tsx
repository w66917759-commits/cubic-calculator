"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import type { CalculatorProject } from "@/lib/calculator/types";
import { encodeProjectState } from "@/lib/calculator/serialization";

interface ShareButtonProps {
  project: CalculatorProject;
}

export function ShareButton({ project }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("state", encodeProjectState(project));
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="icon-button" type="button" onClick={copyShareLink} title="Copy share link">
      {copied ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
      {copied ? "Link copied" : "Share link"}
    </button>
  );
}
