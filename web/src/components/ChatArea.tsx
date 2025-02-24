import Chat from "@/models/Chat";

type ChatAreaProps = {
  chats: Chat[];
};

const ChatArea: React.FC<ChatAreaProps> = ({ chats }) => {
  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.id}>
          <p>{chat.prompt}</p>
          <p>{chat.reply}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
