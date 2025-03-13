import React from "react";
import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";

const Login: React.FC = () => {
  const steps = [
    <div key="step1">
      <p>Enter your username below.</p>
      <StandardInput type="email" placeholder="Email" />
    </div>,
    <div key="step2">
      <p>Enter your password below.</p>
      <StandardInput type="password" placeholder="Password" />
    </div>,
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <>
      <MultistepForm title="Login" steps={steps} onSubmit={handleSubmit} />
    </>
  );
};

export default Login;
