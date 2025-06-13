"use client";

import { defineStepper } from "@stepperize/react";
import { useState } from "react";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import StepperHeader from "./StepperHeader";

const { Scoped, useStepper, steps } = defineStepper(
  {
    id: "step-1",
    title: "Add Bot to your group",
    description: "Add MiniAppsBlockchainBot",
  },
  {
    id: "step-2",
    title: "Configure your mini app",
    description: "Complete the form",
  },
  {
    id: "step-3",
    title: "Share your mini app",
    description: "Get your mini app link",
  }
);

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useStepper();

  return (
    <Scoped>
      <div className="max-w-2xl mx-auto">
        <StepperHeader
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        {methods.when("step-1", (step) => (
          <FirstStep methods={methods} setCurrentStep={setCurrentStep} />
        ))}
        {methods.when("step-2", (step) => (
          <SecondStep methods={methods} setCurrentStep={setCurrentStep} />
        ))}
        {methods.when("step-3", (step) => (
          <ThirdStep methods={methods} setCurrentStep={setCurrentStep} />
        ))}
      </div>
    </Scoped>
  );
}
