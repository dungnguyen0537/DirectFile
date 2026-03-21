"use client";

import { useEffect, useState } from "react";

type CopyLinkButtonProps = {
  url: string;
};

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    setStatus("idle");
  }, [url]);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setStatus("copied");
  }

  return (
    <button
      className={`secondary-button copy-link-button${status === "copied" ? " is-copied" : ""}`}
      onClick={handleCopy}
      type="button"
    >
      {status === "copied" ? "Đã copy" : "Copy link"}
    </button>
  );
}
