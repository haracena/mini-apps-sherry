"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 justify-center h-full items-center pb-8">
      <h2 className="text-3xl font-bold">Create your mini app</h2>
      <p className="text-base text-neutral-500">
        Press the button below to configure your mini app
      </p>
      <Button
        variant={"default"}
        className="w-fit mt-8"
        onClick={() => {
          router.push(`/dashboard/${uuidv4()}`);
        }}
      >
        Create mini app
      </Button>
    </div>
  );
}
