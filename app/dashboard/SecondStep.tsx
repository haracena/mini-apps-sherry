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
import { parseEther, formatEther } from "viem";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { useWalletClient, usePublicClient } from "wagmi";
import { getContract } from "viem";
import { StepperMethods } from "@/types";
import { CONTRACTS } from "@/config/contracts";

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
  methods: StepperMethods;
  setCurrentStep: (step: number) => void;
}

export default function SecondStep({
  methods,
  setCurrentStep,
}: SecondStepProps) {
  const params = useParams();
  const group_id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [originalValues, setOriginalValues] = useState<FormValues | null>(null);
  
  const {
    address,
    connect,
    connecting,
    isConnected,
    isCorrectNetwork,
    switchToAvalanche,
    balance,
    balanceFormatted,
    isLoadingBalance,
    error: walletError,
    refetchBalance
  } = useWallet();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

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
    setCurrentStep(1);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function getGroupOnChain(groupId: string) {
    if (!publicClient) throw new Error("Public client not ready");
    
    const contract = getContract({
      address: CONTRACTS.TELEGRAM_GROUP_INVITATION,
      abi: TelegramGroupInvitationABI,
      client: publicClient,
    });

    const group = await contract.read.getGroup([groupId]);
    return {
      owner: group[0],
      price: group[1],
      referralCommission: group[2],
      exists: Boolean(group[3]),
    };
  }

  async function createGroupOnChain({
    groupId,
    price,
    referralCommission,
  }: {
    groupId: string;
    price: number;
    referralCommission: number;
  }) {
    if (!walletClient) throw new Error("Wallet not connected");
    
    const contract = getContract({
      address: CONTRACTS.TELEGRAM_GROUP_INVITATION,
      abi: TelegramGroupInvitationABI,
      client: walletClient,
    });

    const priceInWei = parseEther(price.toString());
    const hash = await contract.write.createGroup([
      groupId,
      priceInWei,
      referralCommission,
    ]);

    const receipt = await publicClient?.waitForTransactionReceipt({ hash });
    return hash;
  }

  async function updateGroupOnChain({
    groupId,
    price,
    referralCommission,
  }: {
    groupId: string;
    price: number;
    referralCommission: number;
  }) {
    if (!walletClient) throw new Error("Wallet not connected");
    
    const contract = getContract({
      address: CONTRACTS.TELEGRAM_GROUP_INVITATION,
      abi: TelegramGroupInvitationABI,
      client: walletClient,
    });

    const priceInWei = parseEther(price.toString());
    const hash = await contract.write.updateGroup([
      groupId,
      priceInWei,
      referralCommission,
    ]);

    await publicClient?.waitForTransactionReceipt({ hash });
    return hash;
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

    // Verificar conexión de wallet
    if (!isConnected) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first"
      });
      setLoading(false);
      return;
    }

    // Verificar red correcta
    if (!isCorrectNetwork) {
      toast.warning("Wrong Network", {
        description: "Please switch to Avalanche network",
        action: {
          label: "Switch Network",
          onClick: () => switchToAvalanche()
        }
      });
      setLoading(false);
      return;
    }

    try {
      if (originalValues && areValuesEqual(values, originalValues)) {
        setSuccess(true);
        setLoading(false);
        methods.next();
        return;
      }

      const group = await getGroupOnChain(group_id);
      let txHash: string | undefined = undefined;

      if (!group.exists) {
        // Estimar gas y verificar balance antes de crear
        const estimatedCost = parseEther("0.01"); // Estimación conservadora
        if (balance < estimatedCost) {
          toast.error("Insufficient Balance", {
            description: `You need at least 0.01 AVAX for gas. Current balance: ${balanceFormatted} AVAX`
          });
          setLoading(false);
          return;
        }

        toast.info("Creating Group", {
          description: "Please confirm the transaction in your wallet..."
        });

        txHash = await createGroupOnChain({
          groupId: group_id,
          price: values.invitationPrice,
          referralCommission: values.referralCommission ?? 0,
        });
      } else {
        const priceInAvax = Number(formatEther(group.price));
        const onChainChanged =
          Math.abs(values.invitationPrice - priceInAvax) > 0.0001 ||
          values.referralCommission !== Number(group.referralCommission);

        if (onChainChanged) {
          // Verificar balance antes de actualizar
          const estimatedCost = parseEther("0.005"); // Estimación conservadora
          if (balance < estimatedCost) {
            toast.error("Insufficient Balance", {
              description: `You need at least 0.005 AVAX for gas. Current balance: ${balanceFormatted} AVAX`
            });
            setLoading(false);
            return;
          }

          toast.info("Updating Group", {
            description: "Please confirm the transaction in your wallet..."
          });

          txHash = await updateGroupOnChain({
            groupId: group_id,
            price: values.invitationPrice,
            referralCommission: values.referralCommission ?? 0,
          });
        }
      }

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

      // Refrescar balance después de transacción exitosa
      if (txHash) {
        toast.success("Transaction Successful", {
          description: (
            <span>
              View on explorer:{" "}
              <a
                href={`https://snowtrace.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </span>
          ),
          duration: 10000,
        });

        // Refrescar balance
        setTimeout(() => {
          refetchBalance();
        }, 2000);
      }

      methods.next();
    } catch (err: any) {
      const errorMessage = err.message || "Unknown error";
      setError(errorMessage);

      // Manejo de errores específicos
      if (err.code === 4001 || errorMessage.includes("rejected")) {
        toast.error("Transaction Rejected", {
          description: "You rejected the transaction"
        });
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("Insufficient Funds", {
          description: `You don't have enough AVAX. Current balance: ${balanceFormatted} AVAX`
        });
      } else if (errorMessage.includes("gas")) {
        toast.error("Gas Error", {
          description: "Transaction would likely fail. Please check gas settings."
        });
      } else {
        toast.error("Transaction Failed", {
          description: errorMessage
        });
      }
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
                    <div className="space-y-2">
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
                          disabled={connecting || isConnected}
                          variant="outline"
                        >
                          {connecting
                            ? "Connecting..."
                            : isConnected
                              ? "Connected"
                              : "Connect Wallet"}
                        </Button>
                      </div>
                      {isConnected && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500">Balance:</span>
                            <span className="font-medium">
                              {isLoadingBalance ? "..." : `${Number(balanceFormatted).toFixed(4)} AVAX`}
                            </span>
                          </div>
                          {!isCorrectNetwork && (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={switchToAvalanche}
                            >
                              Switch to Avalanche
                            </Button>
                          )}
                        </div>
                      )}
                      {walletError && (
                        <p className="text-xs text-red-500">{walletError.message}</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
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
                      step="0.001"
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
              <Button
                type="submit"
                disabled={loading || !isConnected || !isCorrectNetwork}
                title={
                  !isConnected
                    ? "Please connect your wallet"
                    : !isCorrectNetwork
                    ? "Please switch to Avalanche network"
                    : ""
                }
              >
                {loading ? "Processing..." : "Next Step →"}
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