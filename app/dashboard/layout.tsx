"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "lucide-react";
import { TelegramInvitationConfig } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [miniApps, setMiniApps] = useState<TelegramInvitationConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace("/");
    }
  }, [user, hasHydrated, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("telegram_invitation_configs")
      .select()
      .eq("telegram_user_id", user.id.toString())
      .then(({ data, error }) => {
        if (!error && data) setMiniApps(data);
        setLoading(false);
      });
  }, [user]);

  if (!hasHydrated) {
    return <div />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 pt-16">
      <Image
        src="/assets/images/hero-bg.webp"
        alt="Hero"
        width={1512}
        height={982}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-20"
      />
      <div className="grid grid-cols-[280px_1fr] min-h-[85vh] my-4 rounded-lg overflow-hidden">
        <div className="flex flex-col gap-4 p-4 bg-neutral-900/75 overflow-y-auto">
          <div className="flex flex-col gap-4 h-full">
            <p className="text-base text-neutral-500">Mini Apps Dashboard</p>
            {loading && (
              <span className="text-xs text-neutral-500">Loading...</span>
            )}
            {!loading && miniApps.length === 0 && (
              <span className="text-xs text-neutral-500">
                No mini apps found
              </span>
            )}
            {!loading &&
              miniApps.map((app) => (
                <Link
                  key={app.group_id}
                  href={`/dashboard/${app.group_id}`}
                  className={`text-sm truncate flex items-center gap-2 hover:opacity-100 transition-all duration-300 hover:translate-x-2 ${
                    pathname === `/dashboard/${app.group_id}`
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                >
                  <div
                    className={`size-8 font-bold rounded-full flex items-center justify-center ${
                      pathname === `/dashboard/${app.group_id}`
                        ? "bg-indigo-500"
                        : "bg-neutral-800"
                    }`}
                  >
                    {app.title?.[0]}
                  </div>
                  <span className="text-base font-medium">
                    {app.title || app.group_id}
                  </span>
                </Link>
              ))}
            <Button
              variant={"secondary"}
              className="flex items-center gap-2 justify-center mt-auto"
              onClick={() => {
                router.push(`/dashboard/${uuidv4()}`);
              }}
            >
              <PlusIcon className="w-4 h-4" />
              Create mini app
            </Button>
          </div>
        </div>
        <div className="p-8 bg-neutral-950/50 w-full h-full backdrop-blur-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
