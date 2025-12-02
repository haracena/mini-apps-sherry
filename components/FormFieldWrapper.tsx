import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormFieldWrapper({
  label,
  required,
  tooltip,
  error,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-neutral-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-neutral-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
