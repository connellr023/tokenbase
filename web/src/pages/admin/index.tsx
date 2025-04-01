import TextareaForm from "@/components/TextareaForm";
import React, { useState, useEffect, useCallback } from "react";
import { backendEndpoint } from "@/utils/constants";
import { useBearerContext } from "@/contexts/BearerContext";

const adminPromptEndpoint = backendEndpoint + "api/admin/prompt";

const Admin: React.FC = () => {
  const { bearer } = useBearerContext();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!bearer) {
    throw new Error("Bearer token is not available");
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const res = await fetch(adminPromptEndpoint, {
          method: "GET",
          headers: { Authorization: `Bearer ${bearer.token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch prompt");
        }

        const data = await res.json();
        setPrompt(data.prompt ?? "");
      } catch {
        setPrompt("Failed to fetch prompt");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [bearer.token]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value);
    },
    [setPrompt],
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch(adminPromptEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer.token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const responseHeader = await res.text();
        return `System prompt was not updated: ${responseHeader}`;
      }
    } catch {
      return "An error has occured updating the system prompt";
    } finally {
      setIsLoading(false);
    }
  }, [prompt, bearer.token]);

  return (
    <>
      <TextareaForm
        header="System Prompt"
        desc="Edit the global system prompt below."
        placeholder="Enter prompt."
        value={prompt}
        max={200}
        isDisabled={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Admin;
