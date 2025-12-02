"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <div className="flex gap-4">
          {variant === "destructive" && (
            <div className="rounded-full bg-red-500/10 p-3 h-fit">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          )}
          <div className="flex-1">
            <DialogTitle>{title}</DialogTitle>
            <p className="text-sm text-neutral-400 mt-2">{description}</p>
            <div className="flex gap-3 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === "destructive" ? "destructive" : "default"}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : confirmText}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
