import React from "react";
import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import { emailRegex } from "@/utils/regexps";

const Login: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const steps = [
    <div key="step1">
      <p>Enter your email below.</p>
      <StandardInput type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
    </div>,
    <div key="step2">
      <p>Enter your password below.</p>
      <StandardInput type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
    </div>,
  ];

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return email.trim() !== "" && emailRegex.test(email);
      case 1:
        return password.length < 8;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <>
      <MultistepForm title="Login" steps={steps} onSubmit={handleSubmit} validateStep={validateStep} />
    </>
  );
};

export default Login;
