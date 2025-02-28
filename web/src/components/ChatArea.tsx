import Chat from "@/components/Chat";
import ChatRecord from "@/models/ChatRecord";

type ChatAreaProps = {
  chats: ChatRecord[];
  streamingChat?: ChatRecord;
};

const ChatArea: React.FC<ChatAreaProps> = ({ chats, streamingChat }) => {
  return (
    <div>
      {/* Render all finished chats */}
      {chats.map((chat) => (
        <Chat key={chat.chatId} model={chat} />
      ))}

      {/* If a chat reply is being streamed back, render it here */}
      {streamingChat && (
        <Chat key={streamingChat.chatId ?? -1} model={streamingChat} />
      )}
    </div>
  );
};

export default ChatArea;
