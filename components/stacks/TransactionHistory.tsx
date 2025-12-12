"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  tx_id: string;
  tx_status: "success" | "pending" | "failed";
  tx_type: string;
  fee_rate: string;
  sender_address: string;
  block_height?: number;
  burn_block_time?: number;
  canonical: boolean;
}

interface TransactionHistoryProps {
  address: string;
  limit?: number;
  network?: "mainnet" | "testnet";
}

export function TransactionHistory({
  address,
  limit = 10,
  network = "testnet",
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Implement actual API call to Stacks blockchain
        // For now, using placeholder data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockData: Transaction[] = [];
        setTransactions(mockData);
      } catch (err) {
        setError("Failed to fetch transaction history");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchTransactions();
    }
  }, [address, limit, network]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default" as const,
      pending: "secondary" as const,
      failed: "destructive" as const,
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="w-16 h-6" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="text-center py-8 text-muted-foreground">{error}</div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="text-center py-8 text-muted-foreground">
          No transactions found for this address
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.tx_id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="mt-1">{getStatusIcon(tx.tx_status)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{tx.tx_type}</span>
                {getStatusBadge(tx.tx_status)}
              </div>

              <code className="text-xs text-muted-foreground block truncate">
                {tx.tx_id}
              </code>

              {tx.burn_block_time && (
                <span className="text-xs text-muted-foreground mt-1 block">
                  {formatDistanceToNow(new Date(tx.burn_block_time * 1000), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>

            <a
              href={`https://explorer.stacks.co/txid/${tx.tx_id}?chain=${network}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}
