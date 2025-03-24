import MultistepForm from "@/components/MultistepForm";
import StandardTextArea from "@/components/StandardTextArea";
import LoginRequest from "@/models/LoginRequest";
import React, { useState } from "react";
import { emailRegex } from "@/utils/regexps";
import { minPasswordLength } from "@/utils/constants";

const Admin: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  const isStepValid = (step: number) => {
        return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }

  const steps = [
    <div key="step1">
      <StandardTextArea
        placeholder="Enter prompt" 
        max={200}
        onChange={handleChange}
      />
    </div>
  ];

  const handleSubmit = () => {
    console.log("Form submitted");
  };


  return (
    <>
      <MultistepForm
        title="Change System Prompt"
        steps={steps}
        onSubmit={handleSubmit}
        isStepValid={isStepValid}
      />
    </>
  );
};

export default Admin;
