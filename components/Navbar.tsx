"use client";
import Link from "next/link";
import TelegramLogin from "./TelegramLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 w-full bg-neutral-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="duration-300 transition-all hover:opacity-80" href="/">
          <Image
            src="/assets/images/logo-large.png"
            alt="Logo"
            width={172}
            height={32}
          />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <span className="text-sm">{user.username}</span>
              {user.photo_url && (
                <Avatar>
                  <AvatarImage src={user.photo_url} alt={user.first_name} />
                  <AvatarFallback>
                    {user.first_name?.[0]}
                    {user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <button
                className="ml-2 px-3 py-1 rounded flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-sm"
                onClick={() => setUser(null)}
              >
                Logout
                <LogOutIcon className="size-3" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
