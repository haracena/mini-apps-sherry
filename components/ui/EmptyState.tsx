import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon Container with animated background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
          <Icon className="w-12 h-12 text-purple-400" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-white/60 text-center max-w-md mb-6">
        {description}
      </p>

      {/* Action Button */}
      {(actionLabel && (actionHref || onAction)) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
