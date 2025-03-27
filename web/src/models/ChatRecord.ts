type ChatRecord = {
  prompt: string;
  promptImages?: string[];
  reply: string;
  createdAt?: number; // Will be used to identify chat records uniquely
};

export default ChatRecord;
