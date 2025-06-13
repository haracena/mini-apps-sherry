import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="flex flex-col gap-4 p-4 bg-neutral-900/75">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">Your mini apps</p>
          </div>
        </div>
        <div className="p-8 bg-neutral-950/50 w-full h-full backdrop-blur-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
