import React from "react";
import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import RegisterRequest from "@/models/RegisterRequest";
import { emailRegex } from "@/utils/regexps";

const Register: React.FC = () => {
  const [username, setUsername] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const steps = [
    <div key="step1">
      <p>Enter a username below.</p>
      <StandardInput type="text" placeholder="Username" value={username} isValid={() => validateStep(0)} onChange={(e) => setUsername(e.target.value)} />
    </div>,
    <div key="step2">
      <p>Enter an email below.</p>
      <StandardInput type="email" placeholder="Email" value={email} isValid={() => validateStep(1)} onChange={(e) => setEmail(e.target.value)} />
    </div>,
    <div key="step3">
      <p>Enter a password below.</p>
      <StandardInput type="password" placeholder="Password" value={password} isValid={() => validateStep(2)} onChange={(e) => setPassword(e.target.value)} />
    </div>,
  ];

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return username.trim() !== "";
      case 1:
        return email.trim() !== "" && emailRegex.test(email);
      case 2:
        return password.length < 8;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // Handle form submission
  
    const registerRequest: RegisterRequest = {
      username,
      email,
      password_hash: password,
    };
    console.log(registerRequest);
    console.log("Form submitted");
    

  };

  return (
    <>
      <MultistepForm title="Register" steps={steps} onSubmit={handleSubmit} validateStep={validateStep} />
    </>
  );
};

export default Register;
