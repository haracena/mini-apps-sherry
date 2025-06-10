import Image from "next/image";
import TiltFrame from "./TiltFrame";
import { Button } from "../ui/button";
import Link from "next/link";
import Steps from "./Steps";

export default function HeroSection() {
  return (
    <header className="relative min-h-screen">
      <Image
        src="/assets/images/hero-bg.webp"
        alt="Hero"
        width={1512}
        height={982}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-20"
      />
      <div className="max-w-7xl mx-auto px-4 py-32 grid grid-cols-2 gap-4">
        <div className="text-pretty flex flex-col gap-4">
          <h1 className="text-6xl font-bold text-white">
            Create Telegram invitation links
          </h1>
          <p className="text-neutral-500 text-2xl">
            Automatize yor private telegram group with mini apps on avalanche.
          </p>
          <Link className="mt-4" href="/">
            <Button className="cursor-pointer">Create your mini app</Button>
          </Link>
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
        <div className="flex justify-center items-center">
          <TiltFrame>
            <Image
              src="/assets/images/miniapp-example.png"
              alt="Hero"
              width={350}
              height={470}
              className="rounded-lg"
            />
          </TiltFrame>
        </div>
      </div>
      <Steps />
    </header>
  );
}
