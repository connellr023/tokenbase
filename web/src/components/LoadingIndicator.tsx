import React from "react";
import styles from "@/styles/components/LoadingIndicator.module.scss";

const LoadingIndicator: React.FC = () => {
  return (
    <div className={`${styles.container} fade-in`}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default LoadingIndicator;
