import React from "react";
import MultistepForm from "@/components/MultistepForm";

const Login: React.FC = () => {
  const steps = [
    <div key="step1">
      <h2>Step 1: Enter Email</h2>
      <input type="email" placeholder="Email" />
    </div>,
    <div key="step2">
      <h2>Step 2: Enter Password</h2>
      <input type="password" placeholder="Password" />
    </div>,
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div>
      <h1>Login</h1>
      <MultistepForm steps={steps} onSubmit={handleSubmit} />
    </div>
  );
};

export default Login;
