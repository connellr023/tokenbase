import TextareaForm from "@/components/TextareaForm";
import React, { useState, useEffect } from "react";
import { backendEndpoint } from "@/utils/constants";

const adminEndpoint = backendEndpoint + "api/admin";

const Admin: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(adminEndpoint, {method: "GET"});
        const data = await res.text();
        setPrompt(data || "Enter prompt.");
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
    try{
      const res = await fetch(adminEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(prompt),
      });

      const responseBody = await res.text();
      return responseBody
    } catch {
      return "An error has occured updating the system prompt";
    };
  }

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
