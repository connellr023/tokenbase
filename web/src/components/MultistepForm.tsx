import styles from "@/styles/components/MultistepForm.module.scss";
import React, { useState } from "react";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

type MultistepFormProps = {
  title: string;
  steps: React.ReactNode[];
  onSubmit: () => Promise<string | void>;
  isStepValid: (step: number) => boolean;
};

const MultistepForm: React.FC<MultistepFormProps> = ({
  title,
  steps,
  onSubmit,
  isStepValid,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    const error = await onSubmit();

    if (error) {
      setError(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isStepValid(currentStep) && currentStep + 1 <= steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown} tabIndex={0}>
      <div>
        <h1>{title}</h1>
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
          {currentStep > 0 && (
            <StandardButton icon={faArrowLeft} onClick={prevStep}>
              Previous
            </StandardButton>
          )}
          {currentStep < steps.length - 1 ? (
            <StandardButton
              icon={faArrowRight}
              onClick={nextStep}
              isDisabled={!isStepValid(currentStep)}
            >
              Next
            </StandardButton>
          ) : (
            <StandardButton
              icon={faCheck}
              onClick={handleSubmit}
              isDisabled={!isStepValid(currentStep)}
            >
              Submit
            </StandardButton>
          )}
        </div>
        {error && (
          <div className={styles.errorContainer}>
            <ErrorMessage error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MultistepForm;
