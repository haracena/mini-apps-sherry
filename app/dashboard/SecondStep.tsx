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
import { ChangeEvent, useEffect } from "react";

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
      return data.referralCommission < data.invitationPrice;
    },
    {
      message: "Referral commission must be less than invitation price",
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
  }, []);

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

  function onSubmit(values: FormValues) {
    console.log(values);
    methods.next();
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
                  <Input placeholder="0x..." {...field} className="font-mono" />
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
            <Button type="submit">Next Step →</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
