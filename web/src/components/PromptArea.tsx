import { useState } from "react";

type PromptAreaProps = {
  onSend: (prompt: string) => void;
};

const PromptArea: React.FC<PromptAreaProps> = ({ onSend }) => {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    onSend(prompt);
    setPrompt("");
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default PromptArea;
