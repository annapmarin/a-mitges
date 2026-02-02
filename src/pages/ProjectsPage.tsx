import { Navbar } from "../components/Navbar"
import { useAuth } from "../hooks/useAuth";


export default function ProjectsPage() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return(
    <>
      <Navbar user={user} />
      <div>
      projectes
      </div>
    </>
  );
}