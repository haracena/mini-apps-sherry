import { useEffect } from "react";

interface ThirdStepProps {
  methods: any;
  setCurrentStep: (step: number) => void;
}

export default function ThirdStep({ methods, setCurrentStep }: ThirdStepProps) {
  useEffect(() => {
    setCurrentStep(2);
  }, []);

  return <div>ThirdStep</div>;
}
