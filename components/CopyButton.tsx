import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  value: string;
  successMessage?: string;
}

export function CopyButton({
  value,
  successMessage,
  ...props
}: CopyButtonProps) {
  const { isCopied, copy } = useClipboard();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => copy(value)}
      {...props}
    >
      {isCopied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );
}
