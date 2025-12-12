"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Network, Bell, Eye, Wallet, Save } from "lucide-react";
import { WalletSwitcher } from "@/components/stacks/WalletSwitcher";

export default function StacksSettingsPage() {
  const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
  const [notifications, setNotifications] = useState(true);
  const [showTestTransactions, setShowTestTransactions] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleSave = () => {
    // TODO: Save settings to localStorage or backend
    console.log("Settings saved:", {
      network,
      notifications,
      showTestTransactions,
      autoRefresh,
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <PageTransition>
        <PageHeader
          title="Stacks Settings"
          description="Configure your Stacks blockchain preferences"
        />
      </PageTransition>

      <div className="mt-8 space-y-6">
        {/* Network Settings */}
        <PageTransition delay={50}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Network</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="network">Stacks Network</Label>
                  <p className="text-sm text-muted-foreground">
                    Select which Stacks network to use
                  </p>
                </div>
                <select
                  id="network"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as "mainnet" | "testnet")}
                  className="px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="testnet">Testnet</option>
                  <option value="mainnet">Mainnet</option>
                </select>
              </div>

              {network === "testnet" && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
                  <p className="text-yellow-700 dark:text-yellow-500">
                    ⚠️ You are using Testnet. No real funds are involved.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </PageTransition>

        {/* Wallet Settings */}
        <PageTransition delay={100}>
          <WalletSwitcher />
        </PageTransition>

        {/* Notifications */}
        <PageTransition delay={150}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for transaction updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh blockchain data
                  </p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
            </div>
          </Card>
        </PageTransition>

        {/* Display Settings */}
        <PageTransition delay={200}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Display</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-test-tx">Show Test Transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Display test transactions in history
                  </p>
                </div>
                <Switch
                  id="show-test-tx"
                  checked={showTestTransactions}
                  onCheckedChange={setShowTestTransactions}
                />
              </div>
            </div>
          </Card>
        </PageTransition>

        {/* Save Button */}
        <PageTransition delay={250}>
          <div className="flex justify-end gap-3">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
