import { useState } from "react";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setError(null);
    setConnecting(true);
    try {
      if (!(window as any).ethereum) throw new Error("MetaMask not found");
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
    } catch (err: any) {
      setError(err.message || "Wallet connection failed");
    } finally {
      setConnecting(false);
    }
  };

  return { address, connect, connecting, error };
}
