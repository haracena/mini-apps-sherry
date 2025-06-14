"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const shareUrl = `https://mini-apps-sherry.vercel.app/api/telegram-invitation?group_id=${group_id}`;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  useEffect(() => {
    setCurrentStep(2);
    fetchData();
    if (!group_id) return;
    setLoadingTx(true);
    fetch(`/api/telegram-invitation/transactions?group_id=${group_id}`)
      .then((res) => res.json())
      .then((res) => setTransactions(res.data || []))
      .finally(() => setLoadingTx(false));
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
      <h2 className="text-2xl font-bold mb-8">Your mini app is ready to use</h2>
      {loading ? (
        <div className="py-8 text-center text-neutral-400">
          Loading group config...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="mt-8">
            <div className="mb-2 font-semibold flex items-center gap-2">
              Share your link!{" "}
              <span role="img" aria-label="rocket">
                🚀
              </span>
            </div>
            <div className="flex items-center gap-2">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="h-12">
                    Show mini app info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Group Information</DialogTitle>
                  <div className="space-y-4 mt-2">
                    <div>
                      <span className="font-semibold">Title:</span>{" "}
                      <span className="text-neutral-400 font-normal">
                        {data.title}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Description:</span>{" "}
                      <span className="text-neutral-400 font-normal">
                        {data.description}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Owner wallet:</span>{" "}
                      <span className="text-neutral-400 font-normal">
                        {data.owner_address}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Invitation Price:</span>{" "}
                      <span className="text-neutral-400 font-normal">
                        {data.invitation_price} AVAX
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        Referral Commission:
                      </span>{" "}
                      <span className="text-neutral-400 font-normal">
                        {data.referralCommission ?? 0}%
                      </span>
                    </div>
                    <span className="font-semibold">
                      Platform Commission:{" "}
                      <span className="text-neutral-400 font-normal">
                        0.01 AVAX
                      </span>
                    </span>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">
                      Últimas transacciones on-chain
                    </h4>
                    {loadingTx ? (
                      <div className="text-xs text-neutral-400">
                        Cargando...
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-xs text-neutral-400">
                        No hay transacciones recientes.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr>
                              <th className="text-left">Tx Hash</th>
                              <th className="text-left">Buyer</th>
                              <th className="text-left">Amount</th>
                              <th className="text-left">Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.slice(0, 10).map((tx) => (
                              <tr key={tx.txHash}>
                                <td>
                                  <a
                                    href={`https://testnet.snowtrace.io/tx/${tx.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-400"
                                  >
                                    {tx.txHash.slice(0, 10)}...
                                    {tx.txHash.slice(-6)}
                                  </a>
                                </td>
                                <td>
                                  {tx.buyer.slice(0, 8)}...{tx.buyer.slice(-4)}
                                </td>
                                <td>{Number(tx.amount) / 1e18} AVAX</td>
                                <td>
                                  {tx.timestamp
                                    ? new Date(tx.timestamp).toLocaleString()
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </>
      )}
      <div className="flex gap-4 items-center mt-8">
        <Button variant={"outline"} onClick={() => methods.prev()}>
          ← Prev Step
        </Button>
      </div>
    </div>
  );
}
