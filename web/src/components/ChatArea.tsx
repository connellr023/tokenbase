import ChatRecord from "@/models/ChatRecord";

type ChatAreaProps = {
  chats: ChatRecord[];
};

const ChatArea: React.FC<ChatAreaProps> = ({ chats }) => {
  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.chatId}>
          <p>
            <b>Prompt:</b> {chat.prompt}
          </p>
          <p>
            <b>Reply:</b> {chat.reply}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
