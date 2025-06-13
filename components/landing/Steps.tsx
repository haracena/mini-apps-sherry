import {
  UserCheck,
  Blocks,
  Share2,
  DollarSign,
  Settings,
  UserPlus,
} from "lucide-react";

export default function Steps() {
  return (
    <section className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <UserPlus className="size-8 text-neutral-50" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Connect your Telegram group</h3>
          <p className="text-neutral-400">
            Add the bot and link your group to get started.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Settings className="size-8 text-neutral-50" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Configure your mini app</h3>
          <p className="text-neutral-400">
            Set the title, description, invitation price, and referral
            commission.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <DollarSign className="size-8 text-neutral-50" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Sell your invitation link</h3>
          <p className="text-neutral-400">
            Share your unique link and start earning by selling access to your
            private Telegram group.
          </p>
        </div>
      </div>
    </section>
  );
}
