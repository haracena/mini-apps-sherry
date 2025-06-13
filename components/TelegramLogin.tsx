"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: any) => void;
    };
    onTelegramAuth: (user: any) => void;
  }
}

export default function TelegramLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    // Remove previous widget if exists
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "MiniAppsBlockchainBot"); // Replace with your bot name
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.async = true;

    // Define the callback function
    window.onTelegramAuth = (user: any) => {
      console.log(user);
      setUser(user);
      if (user) router.push("/dashboard");
    };

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [setUser]);

  return <div ref={containerRef} />;
}
