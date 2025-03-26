import styles from "@/styles/components/NavBar.module.scss";
import StandardDropdown from "./StandardDropdown";
import StandardLink from "./StandardLink";
import IconButton from "./IconButton";
import { merriweather400 } from "@/utils/fonts";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import {
  faAnglesLeft,
  faArrowLeft,
  faBolt,
  faSignIn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const { availableModels, setSelectedModel } = useModelsContext();
  const { openDrawer } = useRightDrawerContext();
  const { conversationRecords, selectedConversationIndex } =
    useConversationRecordsContext();

  return (
    <nav className={styles.container}>
      {/* Render model selection */}
      {pathname === "/" && (
        <StandardDropdown
          items={availableModels.map((model) => {
            const split = model.tag.split(":");
            return `${split[0]} (${split[1]})`;
          })}
          onSelect={setSelectedModel}
        />
      )}

      <div className={styles.linksContainer}>
        {/* Render navigation back to main chat page */}
        {pathname !== "/" && (
          <StandardLink icon={faArrowLeft} href="/">
            Chat
          </StandardLink>
        )}

        {/* Render navigation button back to register page */}
        {pathname === "/login" && (
          <StandardLink icon={faBolt} href="/register">
            Register
          </StandardLink>
        )}

        {/* Render navigation button back to login page */}
        {pathname === "/register" && (
          <StandardLink icon={faSignIn} href="/login">
            Login
          </StandardLink>
        )}
      </div>

      {/* Render current conversations information */}
      {selectedConversationIndex !== null && conversationRecords !== null && (
        <div className={styles.conversationInfo}>
          <h3 className={merriweather400.className}>
            {conversationRecords[selectedConversationIndex].name}
          </h3>
        </div>
      )}

      {/* Render logo */}
      <div className={styles.logo}>
        <b>
          <i>tokenbase</i>
        </b>
        {pathname == "/" && (
          <IconButton icon={faAnglesLeft} onClick={openDrawer}>
            Open
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
