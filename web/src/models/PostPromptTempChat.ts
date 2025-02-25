export type PostPromptTempChatRequest = {
  chatId: string;
  prompt: string;
};

export type PostPromptTempChatResponse = {
  messageId: string;
  token: string;
};
