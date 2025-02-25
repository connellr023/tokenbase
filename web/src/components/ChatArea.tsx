import ChatRecord from "@/models/ChatRecord";

type ChatAreaProps = {
  messages: ChatRecord[];
};

const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message) => (
        <div key={message.chatId}>
          <p>
            <b>Prompt:</b> {message.prompt}
          </p>
          <p>
            <b>Reply:</b> {message.reply}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
