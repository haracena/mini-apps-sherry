"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStacksWallet } from "@/hooks/useStacksWallet";
import { STACKS_CONTRACTS } from "@/config/stacks";
import { Search, ExternalLink, Info } from "lucide-react";

export default function StacksExplorerPage() {
  const { isConnected, network } = useStacksWallet();
  const [contractAddress, setContractAddress] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!contractAddress.trim()) return;

    setIsSearching(true);
    try {
      // TODO: Implement actual contract search
      setTimeout(() => {
        setSearchResults({
          address: contractAddress,
          name: "Contract Details",
        });
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      console.error("Search failed:", error);
      setIsSearching(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <PageTransition>
        <PageHeader
          title="Stacks Contract Explorer"
          description="Explore and interact with Clarity smart contracts on Stacks blockchain"
        />
      </PageTransition>

      <div className="mt-8 space-y-6">
        {/* Search Section */}
        <PageTransition delay={50}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Search Contract</h2>
            <div className="flex gap-3">
              <Input
                placeholder="Enter contract address (e.g., ST1...)"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching || !contractAddress.trim()}>
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </Card>
        </PageTransition>

        {/* Deployed Contracts */}
        <PageTransition delay={100}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Deployed Contracts</h2>
            <div className="space-y-4">
              {/* Daily Streak Contract */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Daily Streak</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Daily spin wheel game with streak tracking
                    </p>
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                      {network === "mainnet"
                        ? STACKS_CONTRACTS.dailyStreak.mainnet || "Not deployed"
                        : STACKS_CONTRACTS.dailyStreak.testnet}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://explorer.stacks.co/txid/${
                          network === "mainnet"
                            ? STACKS_CONTRACTS.dailyStreak.mainnet
                            : STACKS_CONTRACTS.dailyStreak.testnet
                        }?chain=${network}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>

              {/* NFT Collection Contract */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">NFT Collection</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      SIP-009 compliant NFT collection contract
                    </p>
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                      {network === "mainnet"
                        ? STACKS_CONTRACTS.nftCollection.mainnet || "Not deployed"
                        : STACKS_CONTRACTS.nftCollection.testnet}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://explorer.stacks.co/txid/${
                          network === "mainnet"
                            ? STACKS_CONTRACTS.nftCollection.mainnet
                            : STACKS_CONTRACTS.nftCollection.testnet
                        }?chain=${network}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </PageTransition>

        {/* Info Section */}
        <PageTransition delay={150}>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Stacks blockchain uses Clarity smart contracts, a decidable language designed for
              security and predictability. All contracts are secured by Bitcoin.
            </AlertDescription>
          </Alert>
        </PageTransition>
      </div>
    </div>
  );
}
