import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import router from "next/router";
import LoginRequest from "@/models/LoginRequest";
import React, { useState } from "react";
import { emailRegex } from "@/utils/regexps";
import { minPasswordLength } from "@/utils/constants";
import StandardDropdown from "@/components/StandardDropdown";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return email.trim() !== "" && emailRegex.test(email);
      case 2:
        return password.length >= minPasswordLength;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const loginRequest: LoginRequest = {
      email,
      password,
    };

    console.log(loginRequest);
    console.log("Form submitted");

    role === "Regular User" || role === ""? router.push("/"): router.push("/admin");

  };

  const steps = [
    <div key="step1">
    <p>Select role: </p>
    <StandardDropdown
      items={["Regular User", "Admin"]}
      onSelect={(index) => setRole(index == 0? "Regular User": "Admin")}
      isValid={() => isStepValid(0)}
    />
    </div>,
    <div key="step2">
      <p>Enter your email below.</p>
      <StandardInput
        type="email"
        placeholder="Email"
        value={email}
        isValid={() => isStepValid(1)}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
    </div>,
    <div key="step3">
      <p>Enter your password below.</p>
      <StandardInput
        type="password"
        placeholder="Password"
        value={password}
        isValid={() => isStepValid(2)}
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
