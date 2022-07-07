import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard";
import LoginSection from "../components/LoginSection";

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return <Dashboard />;
  }

  return <LoginSection />;
};

export default Home;
