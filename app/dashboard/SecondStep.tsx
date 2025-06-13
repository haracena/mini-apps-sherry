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
                    <Input
                      placeholder="0x..."
                      {...field}
                      className="font-mono"
                    />
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
