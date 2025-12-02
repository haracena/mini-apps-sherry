"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { StepperMethods, TelegramInvitationConfig, TelegramInvitation } from "@/types";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { exportToCSV } from "@/lib/export";
import { Download } from "lucide-react";

interface ThirdStepProps {
  methods: StepperMethods;
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
  const [data, setData] = useState<TelegramInvitationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://app.sherry.social/action?url=https://mini-apps-sherry.vercel.app/api/telegram-invitation?group_id=${group_id}`;
  const [transactions, setTransactions] = useState<TelegramInvitation[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  useEffect(() => {
    setCurrentStep(2);
    fetchData();
    if (!group_id) return;
    setLoadingTx(true);

    (async () => {
      const { data, error } = await supabase
        .from("telegram_invitations")
        .select()
        .eq("group_id", group_id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }
      setLoadingTx(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  <Button variant="outline" className="h-12">
                    Show QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Share with QR Code</DialogTitle>
                  <div className="flex flex-col items-center py-4">
                    <QRCodeGenerator value={shareUrl} size={280} />
                    <p className="text-sm text-neutral-400 mt-4 text-center">
                      Scan this QR code to access the invitation link
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
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
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-8 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportToCSV(
                    transactions,
                    `invitations-${group_id}`,
                    [
                      { key: "created_at", label: "Date" },
                      { key: "email", label: "Email" },
                      { key: "payer_address", label: "Payer Address" },
                      { key: "status", label: "Status" },
                      { key: "telegram_invitation_url", label: "Invitation URL" },
                    ]
                  );
                }}
                disabled={transactions.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <Table className="mt-4 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Payer Address</TableHead>
                  <TableHead>Invitation Link</TableHead>
                  <TableHead>
                    Status{" "}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3 inline-block ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          PENDING: the user has not yet paid for the invitation.
                          <br />
                          COMPLETED: the user has paid for the invitation and
                          received the invitation link.
                          <br />
                          FAILED: the user has paid for the invitation but the
                          invitation link was not sent to the user.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-neutral-400"
                    >
                      No invitations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>{tx.email}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.payer_address}
                      </TableCell>
                      <TableCell>
                        {tx.telegram_invitation_url ? (
                          <span className="text-neutral-400">
                            {tx.telegram_invitation_url}
                          </span>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{tx.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
