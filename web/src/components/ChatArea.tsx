import Message from "@/models/Message";

type ChatAreaProps = {
  messages: Message[];
};

const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>
            <strong>Prompt:</strong> {message.prompt}
          </p>
          <p>
            <strong>Reply:</strong> {message.reply}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
