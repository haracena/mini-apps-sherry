import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperHeaderProps {
  steps: Array<{ title: string; description?: string }>;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function StepperHeader({
  steps,
  currentStep,
  onStepChange,
}: StepperHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-4 mb-10">
      {steps.map((step, index) => (
        <Step
          key={index}
          {...step}
          isActive={index === currentStep}
          index={index}
        />
      ))}
    </div>
  );
}

interface StepProps {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  index: number;
}

const Step: React.FC<StepProps> = ({
  title,
  description,
  isCompleted,
  isActive,
  index,
}) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
              ? "border-primary"
              : "border-muted"
          )}
        >
          {isCompleted ? (
            <Check className="w-4 h-4" />
          ) : (
            <span
              className={`text-sm font-bold ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>
          )}
        </div>
      </div>
      <div className="ml-4">
        <p
          className={cn(
            "text-sm font-medium",
            isActive || isCompleted
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm font-light text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
