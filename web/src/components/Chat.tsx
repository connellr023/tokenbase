import ChatRecord from "@/models/ChatRecord";

type ChatProps = {
  model: ChatRecord;
};

const Chat: React.FC<ChatProps> = ({ model: { prompt, reply } }) => {
  return (
    <div>
      <p>
        <b>Prompt:</b> {prompt}
      </p>
      <p>
        <b>Reply:</b> {reply}
      </p>
    </div>
  );
};

export default Chat;
