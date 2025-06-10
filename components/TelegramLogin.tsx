"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

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

  useEffect(() => {
    // Load Telegram Login Widget script
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
      setUser(user);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [setUser]);

  return <div id="telegram-login-container" />;
}
