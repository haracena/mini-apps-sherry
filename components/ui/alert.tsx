import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 border-neutral-800 text-neutral-200",
        info: "bg-blue-500/10 border-blue-500/30 text-blue-200",
        success: "bg-green-500/10 border-green-500/30 text-green-200",
        warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
        error: "bg-red-500/10 border-red-500/30 text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean;
}

export function Alert({
  className,
  variant,
  icon = true,
  children,
  ...props
}: AlertProps) {
  const Icon =
    variant === "error"
      ? AlertCircle
      : variant === "warning"
      ? AlertTriangle
      : variant === "success"
      ? CheckCircle2
      : Info;

  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {icon && <Icon className="h-4 w-4" />}
      <div>{children}</div>
    </div>
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)}
      {...props}
    />
  );
}
