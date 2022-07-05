import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  return (
    <div>
      <p>
        {session.user?.name} and {session.user?.email}
      </p>
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
};

export default Dashboard;
