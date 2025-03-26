import TextareaForm from "@/components/TextareaForm";
import React, { useState } from "react";

const Admin: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = () => {};

  return (
    <>
      <TextareaForm
        header="System Prompt"
        desc="Edit the global system prompt below."
        placeholder="Enter prompt."
        max={200}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Admin;
