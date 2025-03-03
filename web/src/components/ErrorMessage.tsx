import styles from "@/styles/components/ErrorMessage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

type ErrorMessageProps = {
  error: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faWarning} />
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
