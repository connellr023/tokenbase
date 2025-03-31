import styles from "@/styles/components/NavBar.module.scss";
import ButtonColor from "@/models/ButtonColor";
import StandardLink from "./StandardLink";
import IconButton from "./IconButton";
import TitleDropdown from "./TitleDropdown";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import {
  faAnglesLeft,
  faArrowLeft,
  faBolt,
  faPencil,
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
        <TitleDropdown
          items={availableModels.map((model) => {
            const split = model.tag.split(":");
            return [undefined, undefined, `${split[0]} (${split[1]})`];
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
      {selectedConversationIndex !== null &&
        conversationRecords !== null &&
        pathname === "/" && (
          <div className={styles.conversationInfo}>
            <TitleDropdown
              title={conversationRecords[selectedConversationIndex].name}
              items={[
                [faPencil, undefined, "Rename"],
                [faTrash, ButtonColor.Red, "Delete"],
              ]}
              onSelect={(index) => {}}
            />
          </div>
        )}

      {/* Render logo */}
      <div className={styles.logo}>
        <b>
          <i>tokenbase</i>
        </b>
        {pathname === "/" && (
          <IconButton icon={faAnglesLeft} onClick={openDrawer}>
            Open
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
