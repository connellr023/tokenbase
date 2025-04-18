import MultistepForm from "@/components/MultistepForm";
import StandardInput from "@/components/StandardInput";
import React, { useCallback, useState } from "react";
import { emailRegex } from "@/utils/regexps";
import { useChatRecordsContext } from "@/contexts/ChatRecordsContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useRouter } from "next/router";
import { AuthResponse, RegisterRequest } from "@/models/Auth";
import {
  backendEndpoint,
  maxUsernameLength,
  minPasswordLength,
  minUsernameLength,
} from "@/utils/constants";

const registerEndpont = backendEndpoint + "api/register";

const Register: React.FC = () => {
  const { push } = useRouter();
  const { setBearer } = useBearerContext();
  const { clearChats } = useChatRecordsContext();
  const { clearConversationRecords, unselectConversation } =
    useConversationRecordsContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isStepValid = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          const trimmedUsername = username.trim();
          return (
            trimmedUsername.length >= minUsernameLength &&
            trimmedUsername.length <= maxUsernameLength
          );
        case 1:
          return email.trim() !== "" && emailRegex.test(email);
        case 2:
          return password.length >= minPasswordLength;
        case 3:
          return password === confirmPassword;
        default:
          return true;
      }
    },
    [username, email, password, confirmPassword],
  );

  const handleKeyDown = (
    step: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 3 && isStepValid(step)) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
    };

    try {
      const res = await fetch(registerEndpont, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerRequest),
      });

      if (!res.ok) {
        const responseBody = await res.text();

        if (responseBody.includes("`users_username_index` already contains")) {
          return `Username "${username}" has already been used`;
        } else if (
          responseBody.includes("`users_email_index` already contains")
        ) {
          return `An account using "${email}" already exists`;
        } else {
          return "Error registering";
        }
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
      return "An error has occurred during registration";
    }
  }, [
    username,
    email,
    password,
    push,
    setBearer,
    clearChats,
    clearConversationRecords,
    unselectConversation,
  ]);

  const steps = [
    <div key="step1">
      <p>Enter a username below.</p>
      <StandardInput
        type="text"
        placeholder="Username"
        value={username}
        isValid={() => isStepValid(0)}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => handleKeyDown(0, e)}
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
        onKeyDown={(e) => handleKeyDown(1, e)}
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
        onKeyDown={(e) => handleKeyDown(2, e)}
      />
    </div>,
    <div key="step4">
      <p>Confirm your password below.</p>
      <StandardInput
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        isValid={() => isStepValid(3)}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyDown={(e) => handleKeyDown(3, e)}
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
