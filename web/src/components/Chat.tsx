import styles from "@/styles/components/Chat.module.scss";

type ChatProps = {
  prompt: string;
  replyTokens: string[];
  shouldFadeIn: boolean;
};

const Chat: React.FC<ChatProps> = ({ prompt, replyTokens, shouldFadeIn }) => {
  return (
    <div className={styles.container}>
      <p className={styles.prompt}>{prompt}</p>
      {replyTokens.length > 0 && (
        <p className={styles.reply}>
          {replyTokens.map((token, index) => (
            <span key={index} className={shouldFadeIn ? "fade-in" : ""}>
              {token}
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

export default Chat;
