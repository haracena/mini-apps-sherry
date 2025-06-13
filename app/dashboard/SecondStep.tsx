"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TelegramGroupInvitationABI } from "@/abi/TelegramGroupInvitation";
import { Contract, BrowserProvider, parseEther } from "ethers";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(50, "Title must be less than 50 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(150, "Description must be less than 150 characters"),
    ownerAddress: z
      .string()
      .regex(
        /^0x[a-fA-F0-9]{40}$/,
        "Please enter a valid Avalanche wallet owner address"
      ),
    invitationPrice: z
      .number({
        required_error: "Invitation price is required",
        invalid_type_error: "Invitation price must be a number",
      })
      .min(0, "Price must be 0 or greater"),
    referralCommission: z
      .number()
      .optional()
      .refine(
        (val) => {
          if (val === undefined) return true;
          return val >= 0 && val <= 100;
        },
        { message: "Commission must be between 0 and 100 percent" }
      ),
  })
  .refine(
    (data) => {
      if (data.referralCommission === undefined) return true;
      return data.referralCommission <= 100;
    },
    {
      message: "Referral commission must be equal or less than 100%",
      path: ["referralCommission"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface SecondStepProps {
  methods: any;
  setCurrentStep: (step: number) => void;
}

const CONTRACT_ADDRESS = "0x6aC5052432CDdb9Ff4F1b39DA03CA133dBCd8DcF"; // Reemplaza por tu address real

async function createGroupOnChain({
  groupId,
  price, // en AVAX
  referralCommission,
}: {
  groupId: string;
  price: number;
  referralCommission: number;
}) {
  if (!(window as any).ethereum) throw new Error("MetaMask not found");
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  const provider = new BrowserProvider((window as any).ethereum, {
    name: "avalanche-fuji",
    chainId: 43113,
  });
  const signer = await provider.getSigner();
  const contract = new Contract(
    CONTRACT_ADDRESS,
    TelegramGroupInvitationABI,
    signer
  );
  const priceInWei = parseEther(price.toString());
  const tx = await contract.createGroup(
    groupId,
    priceInWei,
    referralCommission
  );
  await tx.wait();
  return tx.hash;
}

async function getGroupOnChain(groupId: string) {
  if (!(window as any).ethereum) throw new Error("MetaMask not found");
  const provider = new BrowserProvider((window as any).ethereum, {
    name: "avalanche-fuji",
    chainId: 43113,
  });
  const contract = new Contract(
    CONTRACT_ADDRESS,
    TelegramGroupInvitationABI,
    provider
  );
  const group = await contract.getGroup(groupId);
  // group: [owner, price, referralCommission, exists]
  return {
    owner: group[0],
    price: group[1],
    referralCommission: group[2],
    exists: Boolean(group[3]),
  };
}

async function updateGroupOnChain({
  groupId,
  price, // en AVAX
  referralCommission,
}: {
  groupId: string;
  price: number;
  referralCommission: number;
}) {
  if (!(window as any).ethereum) throw new Error("MetaMask not found");
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  const provider = new BrowserProvider((window as any).ethereum, {
    name: "avalanche-fuji",
    chainId: 43113,
  });
  const signer = await provider.getSigner();
  const contract = new Contract(
    CONTRACT_ADDRESS,
    TelegramGroupInvitationABI,
    signer
  );
  const priceInWei = parseEther(price.toString());
  const tx = await contract.updateGroup(
    groupId,
    priceInWei,
    referralCommission
  );
  await tx.wait();
  return tx.hash;
}

export default function SecondStep({
  methods,
  setCurrentStep,
}: SecondStepProps) {
  useEffect(() => {
    setCurrentStep(1);
    fetchData();
  }, []);

  const params = useParams();
  const group_id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [originalValues, setOriginalValues] = useState<FormValues | null>(null);
  const { address, connect, connecting, error: walletError } = useWallet();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ownerAddress: "",
      invitationPrice: undefined,
      referralCommission: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (address) {
      form.setValue("ownerAddress", address, { shouldValidate: true });
    }
  }, [address, form]);

  async function fetchData() {
    setFetching(true);
    try {
      const res = await fetch(`/api/telegram-invitation-configs/${group_id}`);
      if (!res.ok) throw new Error("Error fetching group config");
      const { data } = await res.json();
      if (data) {
        const loaded = {
          title: data.title || "",
          description: data.description || "",
          ownerAddress: data.owner_address || "",
          invitationPrice: data.invitation_price ?? undefined,
          referralCommission: data.referralCommission ?? undefined,
        };
        form.reset(loaded);
        setOriginalValues(loaded);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setFetching(false);
    }
  }

  function areValuesEqual(a: FormValues, b: FormValues) {
    return (
      a.title === b.title &&
      a.description === b.description &&
      a.ownerAddress === b.ownerAddress &&
      a.invitationPrice === b.invitationPrice &&
      a.referralCommission === b.referralCommission
    );
  }

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (originalValues && areValuesEqual(values, originalValues)) {
        setSuccess(true);
        setLoading(false);
        methods.next();
        return;
      }
      // 1. Consultar si el grupo existe en el contrato
      const group = await getGroupOnChain(group_id);
      let txHash: string | undefined = undefined;
      if (!group.exists) {
        // Crear grupo en el smart contract
        txHash = await createGroupOnChain({
          groupId: group_id,
          price: values.invitationPrice,
          referralCommission: values.referralCommission ?? 0,
        });
      } else {
        // Detectar si cambiaron los campos on-chain
        const onChainChanged =
          values.invitationPrice !== Number(group.price) / 1e18 ||
          values.referralCommission !== Number(group.referralCommission);
        if (onChainChanged) {
          txHash = await updateGroupOnChain({
            groupId: group_id,
            price: values.invitationPrice,
            referralCommission: values.referralCommission ?? 0,
          });
        }
      }
      // 2. Actualizar en Supabase (siempre)
      const res = await fetch(`/api/telegram-invitation-configs/${group_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          owner_address: values.ownerAddress,
          invitation_price: values.invitationPrice,
          referralCommission: values.referralCommission,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error updating group config");
      }
      setSuccess(true);
      setOriginalValues(values);
      if (txHash) {
        toast.success("Group updated on blockchain", {
          description: (
            <span>
              Tx:{" "}
              <a
                href={`https://testnet.snowtrace.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                {txHash.slice(0, 10)}...
              </a>
            </span>
          ),
          duration: 8000,
        });
      }
      methods.next();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    if (value === "") {
      field.onChange(undefined);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        field.onChange(numValue);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Configure your mini app</h2>
      <Form {...form}>
        {fetching ? (
          <div className="py-8 text-center text-neutral-400">
            Loading group config...
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner wallet address</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input
                        {...field}
                        className="font-mono"
                        placeholder="0x..."
                        value={address || field.value}
                        readOnly
                      />
                      <Button
                        type="button"
                        onClick={connect}
                        disabled={!!address || connecting}
                        variant="outline"
                      >
                        {connecting
                          ? "Connecting..."
                          : address
                          ? "Connected"
                          : "Connect Wallet"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {walletError && (
                    <div className="text-red-500 text-xs">{walletError}</div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invitationPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Price AVAX</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter price"
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => handleNumberChange(e, field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referralCommission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Commission % (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Enter commission percentage"
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => handleNumberChange(e, field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center mt-8">
              <Button variant={"outline"} onClick={() => methods.prev()}>
                ← Prev Step
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Next Step →"}
              </Button>
            </div>
          </form>
        )}
      </Form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">Configuration updated!</p>}
    </div>
  );
}
