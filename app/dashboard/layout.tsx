"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const [miniApps, setMiniApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <Image
        src="/assets/images/hero-bg.webp"
        alt="Hero"
        width={1512}
        height={982}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-20"
      />
      <h1 className="text-4xl font-bold mb-4 mt-4">Dashboard</h1>
      <div className="grid grid-cols-[280px_1fr] min-h-[75vh] rounded-lg overflow-hidden">
        <div className="flex flex-col gap-4 p-4 bg-neutral-900/75 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <p className="text-base text-neutral-500">Your mini apps</p>
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
                  className="text-sm truncate flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-300 hover:translate-x-2"
                >
                  <div className="size-8 font-bold rounded-full bg-neutral-800 flex items-center justify-center">
                    {app.title?.[0]}
                  </div>
                  <span className="text-base font-medium">
                    {app.title || app.group_id}
                  </span>
                </Link>
              ))}
          </div>
        </div>
        <div className="p-8 bg-neutral-950/50 w-full h-full backdrop-blur-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
