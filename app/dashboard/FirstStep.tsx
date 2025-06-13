"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { CheckCircle2, Loader2 } from "lucide-react";

interface FirstStepProps {
  methods: any;
  setCurrentStep: (step: number) => void;
}

export default function FirstStep({ methods, setCurrentStep }: FirstStepProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [groupName, setGroupName] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    setCurrentStep(0);
    checkConnection(); // Check connection on mount
  }, []);

  const checkConnection = async () => {
    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .from("telegram_invitation_configs")
        .select()
        .eq("group_id", id)
        .single();

      if (error) {
        console.error("Error checking connection:", error);
        setIsConnected(false);
        setGroupName(null);
        return;
      }

      setIsConnected(!!data);
      setGroupName(data?.telegram_group_name || null);
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsConnected(false);
      setGroupName(null);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        Add <span className="font-bold">MiniApps Blockchain Bot</span> to your
        group
      </h2>
      <p>Click on the following link to add the bot to your group</p>

      <Link
        href="https://t.me/MiniAppsBlockchainBot?startgroup=start"
        target="_blank"
        className="w-fit"
      >
        <Button variant={"outline"} className="w-fit">
          Add bot to your group
        </Button>
      </Link>

      <h2 className="text-2xl font-bold mt-4">Link your group</h2>
      <p>After you added mini app bot type in your group chat</p>
      <p className="text-indigo-500 font-bold">/linkgroup {id}</p>
      <h2 className="text-2xl font-bold mt-4">Check group connection</h2>
      <div className="flex gap-4 items-center">
        <Button
          variant={"outline"}
          className="w-fit"
          onClick={checkConnection}
          disabled={isChecking}
        >
          {isChecking ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </span>
          ) : (
            "Check connection"
          )}
        </Button>
        <p
          className={`text-sm ${
            isConnected ? "text-green-500" : "text-neutral-400"
          }`}
        >
          {isConnected ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Your group "{groupName}" is connected to the bot
            </span>
          ) : (
            "Your group is not connected to the bot"
          )}
        </p>
      </div>
      <div className="flex mt-8">
        <Button
          className="w-fit"
          onClick={() => {
            methods.next();
          }}
          disabled={!isConnected}
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
}
