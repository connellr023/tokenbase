import styles from "@/styles/components/StandardLink.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type StandardLinkProps = {
  icon?: IconProp;
  label: string;
  href: string;
};

const StandardLink: React.FC<StandardLinkProps> = ({ icon, label, href }) => {
  return (
    <div className={styles.container}>
      <Link href={href} legacyBehavior>
        <a className={styles.container} draggable={false}>
          {icon && <FontAwesomeIcon icon={icon} />}
          <span>{label}</span>
        </a>
      </Link>
    </div>
  );
};

export default StandardLink;
