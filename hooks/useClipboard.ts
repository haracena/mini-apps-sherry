import { useState } from "react";

export function useClipboard(timeout: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), timeout);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setIsCopied(false);
      return false;
    }
  };

  return { isCopied, copy };
}
