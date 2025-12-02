"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

export function QRCodeGenerator({ value, size = 256 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Error generating QR code:", error);
          setIsLoading(false);
        }
      }
    };

    generateQR();
  }, [value, size]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "invitation-qr-code.png";
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-lg">
        {isLoading && (
          <div
            className="bg-neutral-200 animate-pulse rounded"
            style={{ width: size, height: size }}
          />
        )}
        <canvas ref={canvasRef} className={isLoading ? "hidden" : ""} />
      </div>
      <Button onClick={downloadQR} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
}
