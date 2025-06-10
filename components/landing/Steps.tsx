import { UserCheck, Blocks, Share2 } from "lucide-react";

export default function Steps() {
  return (
    <section className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <UserCheck className="size-8 text-neutral-50" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Create your mini app</h3>
          <p className="text-neutral-400">
            Create your mini app with our easy to use editor.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Blocks className="size-8 text-neutral-50" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Create your mini app</h3>
          <p className="text-neutral-400">
            Create your mini app with our easy to use editor.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Share2 className="size-8 text-neutral-50" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Create your mini app</h3>
          <p className="text-neutral-400">
            Create your mini app with our easy to use editor.
          </p>
        </div>
      </div>
    </section>
  );
}
