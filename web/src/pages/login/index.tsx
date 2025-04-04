import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import React, { useCallback, useState } from "react";
import { LoginRequest, AuthResponse } from "@/models/Auth";
import { emailRegex } from "@/utils/regexps";
import { backendEndpoint, minPasswordLength } from "@/utils/constants";
import { useBearerContext } from "@/contexts/BearerContext";
import { useRouter } from "next/router";
import { useChatRecordsContext } from "@/contexts/ChatRecordsContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";

const loginEndpont = backendEndpoint + "api/login";

const Login: React.FC = () => {
  const { push } = useRouter();
  const { setBearer } = useBearerContext();
  const { clearChats } = useChatRecordsContext();
  const { clearConversationRecords, unselectConversation } =
    useConversationRecordsContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isStepValid = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return email.trim() !== "" && emailRegex.test(email);
        case 1:
          return password.length >= minPasswordLength;
        default:
          return true;
      }
    },
    [email, password],
  );

  const handleKeyDown = (
    step: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 1 && isStepValid(step)) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    const loginRequest: LoginRequest = {
      email,
      password,
    };

    try {
      const res = await fetch(loginEndpont, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      if (!res.ok) {
        return "Check your email and password.";
      }

      const data = (await res.json()) as AuthResponse;

      clearChats();
      clearConversationRecords();
      unselectConversation();
      setBearer({
        token: data.jwt,
        user: data.user,
      });

      push("/");
    } catch {
      return "An error occurred while logging in.";
    }
  }, [
    email,
    password,
    clearChats,
    clearConversationRecords,
    unselectConversation,
    setBearer,
    push,
  ]);

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
        onKeyDown={(e) => handleKeyDown(0, e)}
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
        onKeyDown={(e) => handleKeyDown(1, e)}
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
