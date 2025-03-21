import React from "react";
import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import { emailRegex } from "@/utils/regexps";
import LoginRequest from "@/models/LoginRequest";

const Login: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const steps = [
    <div key="step1">
      <p>Enter your email below.</p>
      <StandardInput type="email" placeholder="Email" value={email} isValid={() => validateStep(0)} onChange={(e) => {setEmail(e.target.value)}} />
    </div>,
    <div key="step2">
      <p>Enter your password below.</p>
      <StandardInput type="password" placeholder="Password" value={password} isValid={() => validateStep(1)} onChange={(e) => {setPassword(e.target.value)}} />
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

    const loginRequest: LoginRequest = {
      email,
      password_hash: password,
    };
    console.log(loginRequest);
    console.log("Form submitted");

    // TODO: Send request to the server

  };

  return (
    <>
      <MultistepForm title="Login" steps={steps} onSubmit={handleSubmit} validateStep={validateStep} />
    </>
  );
};

export default Login;
