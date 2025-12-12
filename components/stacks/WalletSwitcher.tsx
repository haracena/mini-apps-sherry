"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Wallet } from "lucide-react";

export type WalletType = "leather" | "xverse" | "asigna";

interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
}

interface WalletSwitcherProps {
  currentWallet?: WalletType;
  onWalletChange?: (wallet: WalletType) => void;
}

export function WalletSwitcher({ currentWallet, onWalletChange }: WalletSwitcherProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | undefined>(currentWallet);

  const walletOptions: WalletOption[] = [
    {
      id: "leather",
      name: "Leather Wallet",
      description: "Official Hiro wallet for Stacks and Bitcoin",
      icon: "🔷",
      isAvailable: typeof window !== "undefined" && "LeatherProvider" in window,
    },
    {
      id: "xverse",
      name: "Xverse",
      description: "Multi-chain wallet supporting Stacks, Bitcoin & Ordinals",
      icon: "⭐",
      isAvailable: typeof window !== "undefined" && "XverseProviders" in window,
    },
    {
      id: "asigna",
      name: "Asigna",
      description: "Decentralized wallet for Stacks ecosystem",
      icon: "🌐",
      isAvailable: typeof window !== "undefined" && "AsignaProvider" in window,
    },
  ];

  const handleWalletSelect = (walletId: WalletType) => {
    setSelectedWallet(walletId);
    onWalletChange?.(walletId);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Select Wallet</h3>
      </div>

      <div className="space-y-3">
        {walletOptions.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => wallet.isAvailable && handleWalletSelect(wallet.id)}
            disabled={!wallet.isAvailable}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedWallet === wallet.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            } ${!wallet.isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{wallet.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{wallet.name}</h4>
                  {!wallet.isAvailable && (
                    <Badge variant="secondary" className="text-xs">
                      Not Installed
                    </Badge>
                  )}
                  {selectedWallet === wallet.id && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{wallet.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!walletOptions.some((w) => w.isAvailable) && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
          <p className="text-yellow-700 dark:text-yellow-500">
            No Stacks wallet detected. Please install one of the supported wallets to continue.
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        <p>💡 Tip: Install a wallet extension to interact with Stacks blockchain</p>
      </div>
    </Card>
  );
}
