import Head from "next/head";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: "300",
});

const Home = () => {
  return (
    <>
      <Head>
        <title>TokenBase</title>
        <meta name="description" content="Project for SENG 513!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${ubuntu.className}`}
      >
        <main>
          <h1>Hello!</h1>
        </main>
      </div>
    </>
  );
}

export default Home;