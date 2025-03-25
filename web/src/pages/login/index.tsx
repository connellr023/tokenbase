import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import LoginRequest from "@/models/LoginRequest";
import React, { useState } from "react";
import { emailRegex } from "@/utils/regexps";
import { minPasswordLength } from "@/utils/constants";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return email.trim() !== "" && emailRegex.test(email);
      case 1:
        return password.length >= minPasswordLength;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    const loginRequest: LoginRequest = {
      email,
      password,
    };

    console.log(loginRequest);
    console.log("Form submitted");
  };

  const steps = [
    <div key="step1">
      <p>Enter your email below.</p>
      <StandardInput
        type="email"
        placeholder="Email"
        value={email}
        isValid={() => isStepValid(0)}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
    </div>,
    <div key="step2">
      <p>Enter your password below.</p>
      <StandardInput
        type="password"
        placeholder="Password"
        value={password}
        isValid={() => isStepValid(1)}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
    </div>,
  ];

  return (
    <>
      <MultistepForm
        title="Login"
        steps={steps}
        onSubmit={handleSubmit}
        isStepValid={isStepValid}
      />
    </>
  );
};

export default Login;
