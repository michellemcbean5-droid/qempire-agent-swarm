interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white"
                  : "bg-[#1a1a2e] border border-[#4169E1]/20 text-white/40"
              } ${isCurrent ? "ring-2 ring-[#00FFFF] ring-offset-2 ring-offset-[#0A0A1A]" : ""}`}
              title={step}
            >
              {stepNumber}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  stepNumber < currentStep ? "bg-gradient-to-r from-[#4169E1] to-[#BF00FF]" : "bg-[#4169E1]/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
