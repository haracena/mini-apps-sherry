import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center items-center">
        <p className="text-sm text-neutral-500">
          Made with ❤️ for{" "}
          <span className="text-indigo-500">Sherry Minithon</span> by{" "}
          <Link
            href="https://portfolio-haracena.vercel.app/"
            target="_blank"
            className="underline transition-all duration-300 hover:text-neutral-50"
          >
            Haracena
          </Link>
        </p>
      </div>
    </footer>
  );
}
