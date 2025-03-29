import TextareaForm from "@/components/TextareaForm";
import React, { useState, useEffect } from "react";
import { backendEndpoint } from "@/utils/constants";
import { useBearerContext } from "@/contexts/BearerContext";

const adminEndpoint = backendEndpoint + "api/admin";

const Admin: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const { bearer } = useBearerContext();

  if (!bearer) {
    console.error("Bearer is undefined");
    return;
  }

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(adminEndpoint, { method: "GET" });
        const data = await res.json();
        setPrompt(data.prompt || "Enter prompt.");
      } catch (error) {
        console.error("Failed to fetch system prompt:", error);
        setPrompt("Enter prompt.");
      }
    };

    fetchPrompt();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(adminEndpoint, {
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
    }
  };

  return (
    <>
      <TextareaForm
        header="System Prompt"
        desc="Edit the global system prompt below."
        placeholder="Enter prompt."
        value={prompt}
        max={200}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Admin;
