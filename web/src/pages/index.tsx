import UserChat from "@/components/UserChat";
import GuestChat from "@/components/GuestChat";
import { GetServerSideProps } from "next";
import { getChatSuggestions } from "@/utils/getChatSuggestions";
import { useBearerContext } from "@/contexts/BearerContext";

type HomeProps = {
  chatSuggestions: string[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  req,
}) => {
  return {
    props: {
      chatSuggestions: await getChatSuggestions(),
    },
  };
};

const Home: React.FC<HomeProps> = ({ chatSuggestions }) => {
  const { bearer } = useBearerContext();

  return (
    <>
      {bearer?.user ? (
        <UserChat chatSuggestions={chatSuggestions} />
      ) : (
        <GuestChat chatSuggestions={chatSuggestions} />
      )}
    </>
  );
};

export default Home;
