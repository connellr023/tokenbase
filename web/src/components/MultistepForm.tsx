import styles from "@/styles/components/MultistepForm.module.scss";
import React, { useState } from "react";
import StandardButton from "./StandardButton";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

type MultistepFormProps = {
  title: string;
  steps: React.ReactNode[];
  onSubmit: () => void;
  validateStep: (step: number) => boolean; 
};

const MultistepForm: React.FC<MultistepFormProps> = ({
  title,
  steps,
  onSubmit,
  validateStep,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (validateStep(currentStep)) {
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
    <div className={styles.container}>
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
            <StandardButton icon={faArrowRight} onClick={nextStep}>
              Next
            </StandardButton>
          ) : (
            <StandardButton icon={faCheck} onClick={nextStep}>
              Submit
            </StandardButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultistepForm;
