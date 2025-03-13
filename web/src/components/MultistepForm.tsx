import styles from "@/styles/components/MultistepForm.module.scss";
import React, { useState } from "react";

type MultistepFormProps = {
  steps: React.ReactNode[];
  onSubmit: () => void;
};

const MultistepForm: React.FC<MultistepFormProps> = ({ steps, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <div className={styles.stepIndicator}>
        {steps.map((_, index) => (
          <span
            key={index}
            className={index === currentStep ? styles.active : ""}
          ></span>
        ))}
      </div>
      <div className={styles.stepContainer}>{steps[currentStep]}</div>
      <div className={styles.buttonContainer}>
        {currentStep > 0 && <button onClick={prevStep}>Previous</button>}
        <button onClick={nextStep}>
          {currentStep < steps.length - 1 ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default MultistepForm;
