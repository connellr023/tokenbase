import React from "react";
import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";

const Register: React.FC = () => {
  const steps = [
    <div key="step1">
      <p>Enter a username below.</p>
      <StandardInput type="text" placeholder="Username" />
    </div>,
    <div key="step2">
      <p>Enter an email below.</p>
      <StandardInput type="email" placeholder="Email" />
    </div>,
    <div key="step3">
      <p>Enter a password below.</p>
      <StandardInput type="password" placeholder="Password" />
    </div>,
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <>
      <MultistepForm title="Register" steps={steps} onSubmit={handleSubmit} />
    </>
  );
};

export default Register;
