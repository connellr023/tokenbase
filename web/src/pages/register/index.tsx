import React from "react";
import MultistepForm from "@/components/MultistepForm";

const Register: React.FC = () => {
  const steps = [
    <div key="step1">
      <h2>Step 1: Enter Username</h2>
      <input type="text" placeholder="Username" />
    </div>,
    <div key="step2">
      <h2>Step 2: Enter Email</h2>
      <input type="email" placeholder="Email" />
    </div>,
    <div key="step3">
      <h2>Step 3: Enter Password</h2>
      <input type="password" placeholder="Password" />
    </div>,
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div>
      <h1>Register</h1>
      <MultistepForm steps={steps} onSubmit={handleSubmit} />
    </div>
  );
};

export default Register;
