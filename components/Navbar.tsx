"use client";
import Link from "next/link";
import TelegramLogin from "./TelegramLogin";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="fixed top-0 z-50 w-full bg-neutral-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">Logo</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              {user.photo_url && (
                <img
                  src={user.photo_url}
                  alt={user.first_name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm">
                {user.first_name} {user.last_name}
              </span>
            </div>
          ) : (
            <TelegramLogin />
          )}
        </div>
      </div>
    </nav>
  );
}
