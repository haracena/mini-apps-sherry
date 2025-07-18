"use client";
import Image from "next/image";
import TiltFrame from "./TiltFrame";
import { Button } from "../ui/button";
import Link from "next/link";
import Steps from "./Steps";
import TelegramLogin from "../TelegramLogin";
import { useAuthStore } from "@/store/useAuthStore";

export default function HeroSection() {
  const user = useAuthStore((state) => state.user);
  return (
    <header className="relative min-h-screen">
      <Image
        src="/assets/images/hero-bg.webp"
        alt="Hero"
        width={1512}
        height={982}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-20"
      />
      <div className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-2 gap-4">
        <div className="text-pretty flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-white">
            Unlock Private Telegram Groups with Blockchain
          </h1>
          <p className="text-neutral-400 text-xl mb-4">
            Automate access, monetize your community, and manage invitations
            securely with Avalanche-powered mini apps.
          </p>
          <Link
            href="https://t.me/MiniAppsBlockchainBot"
            target="_blank"
            className="text-neutral-400 text-sm"
          >
            Before logging in, you must open{" "}
            <span className="underline">
              {" "}
              this link and press <b>Start</b> in the bot to link your Telegram
              account.
            </span>
          </Link>
          {user ? (
            <Link
              className="w-fit cursor-pointer hover:-translate-y-1 duration-300"
              href="/dashboard"
            >
              <Button className="w-fit cursor-pointer">Go to dashboard</Button>
            </Link>
          ) : (
            <TelegramLogin />
          )}
          <p className="text-neutral-500 font-medium mt-12">Built on</p>
          <div className="flex gap-4">
            <Image
              src="/assets/images/avalanche-logo.svg"
              alt="AVAX"
              width={144}
              height={30}
              className="opacity-50"
            />
            <Image
              src="/assets/images/sherry-logo.png"
              alt="Sherry"
              width={100}
              height={30}
              className="opacity-50"
            />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <TiltFrame>
            <Image
              src="/assets/images/miniapp-example2.webp"
              alt="Hero"
              width={350}
              height={470}
              className="rounded-lg"
            />
            <Image
              src="/assets/images/miniapp-example.webp"
              alt="Hero"
              width={350}
              height={470}
              className="rounded-lg absolute top-0 left-0 inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-[600ms]"
            />
          </TiltFrame>
        </div>
      </div>
      <Steps />
    </header>
  );
}
