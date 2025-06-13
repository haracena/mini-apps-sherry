"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy } from "lucide-react";

interface ThirdStepProps {
  methods: any;
  setCurrentStep: (step: number) => void;
}

function shortenUrl(url: string, chars = 28) {
  if (url.length <= chars) return url;
  const start = url.slice(0, 32);
  const end = url.slice(-12);
  return `${start}...${end}`;
}

export default function ThirdStep({ methods, setCurrentStep }: ThirdStepProps) {
  const params = useParams();
  const group_id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://mini-apps-sherry.vercel.app/api/telegram-mini-app/${group_id}`;

  useEffect(() => {
    setCurrentStep(2);
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/telegram-invitation-configs/${group_id}`);
      const result = await res.json();
      if (!res.ok || !result.data) throw new Error("Group config not found");
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Configure your mini app</h2>
      {loading ? (
        <div className="py-8 text-center text-neutral-400">
          Loading group config...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Title:</span> {data.title}
          </div>
          <div>
            <span className="font-semibold">Description:</span>{" "}
            {data.description}
          </div>
          <div>
            <span className="font-semibold">Owner wallet:</span>{" "}
            {data.owner_address}
          </div>
          <div>
            <span className="font-semibold">Invitation Price:</span>{" "}
            {data.invitation_price} AVAX
          </div>
          <div>
            <span className="font-semibold">Referral Commission:</span>{" "}
            {data.referralCommission ?? 0}%
          </div>
          <div>
            <span className="font-semibold">Profit for creator:</span>{" "}
            {(
              data.invitation_price -
              data.invitation_price * ((data.referralCommission ?? 0) / 100)
            ).toFixed(2)}{" "}
            AVAX
          </div>
          <div className="mt-8">
            <div className="mb-2 font-semibold flex items-center gap-2">
              Share your link!{" "}
              <span role="img" aria-label="rocket">
                🚀
              </span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900 rounded px-4 py-2 w-full max-w-[440px]">
              <input
                className="bg-transparent outline-none text-white w-full"
                value={shortenUrl(shareUrl)}
                readOnly
                onFocus={(e) => e.target.select()}
                title={shareUrl}
              />
              <Button
                size="sm"
                onClick={handleCopy}
                type="button"
                variant="ghost"
              >
                {copied ? "Copied!" : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-4 items-center mt-8">
        <Button variant={"outline"} onClick={() => methods.prev()}>
          ← Prev Step
        </Button>
      </div>
    </div>
  );
}
