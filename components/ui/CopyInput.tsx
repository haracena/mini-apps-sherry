"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface CopyInputProps {
  value: string;
}

export function CopyInput({ value }: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 bg-neutral-900 rounded px-4 py-2 w-fit">
      <span className="text-indigo-500 font-bold font-mono">{value}</span>
      <Button size="sm" onClick={handleCopy} type="button" variant="ghost">
        {copied ? "Copied!" : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}
