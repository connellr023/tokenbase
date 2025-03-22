import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import RegisterRequest from "@/models/RegisterRequest";
import React, { useState } from "react";
import { emailRegex } from "@/utils/regexps";
import { minPasswordLength } from "@/utils/constants";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return username.trim() !== "";
      case 1:
        return email.trim() !== "" && emailRegex.test(email);
      case 2:
        return password.length >= minPasswordLength;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
    };

    console.log(registerRequest);
    console.log("Form submitted");
  };

  const steps = [
    <div key="step1">
      <p>Enter a username below.</p>
      <StandardInput
        type="text"
        placeholder="Username"
        value={username}
        isValid={() => isStepValid(0)}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>,
    <div key="step2">
      <p>Enter an email below.</p>
      <StandardInput
        type="email"
        placeholder="Email"
        value={email}
        isValid={() => isStepValid(1)}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>,
    <div key="step3">
      <p>Enter a password below.</p>
      <StandardInput
        type="password"
        placeholder="Password"
        value={password}
        isValid={() => isStepValid(2)}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>,
  ];

  return (
    <>
      <MultistepForm
        title="Register"
        steps={steps}
        onSubmit={handleSubmit}
        isStepValid={isStepValid}
      />
    </>
  );
};

export default Register;
