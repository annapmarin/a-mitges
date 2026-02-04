import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { GroupCard } from "../components/GroupCard"
import { useAuth } from "../hooks/useAuth"
import { useGroups } from "../hooks/useGroups"
import "../styles/projects-page.css"

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth()
  const { groups, loading: groupsLoading } = useGroups(user?.uid) // ✅ Siempre se llama
  const navigate = useNavigate()

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

  if (authLoading || groupsLoading) return <div>Cargant...</div>

  return (
    <>
      {user && <Navbar user={user} />}
      <main className="projects-page">
        <h1>Els meus grups</h1>

        <section className="groups-list">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              color={getRandomColor()}
              onClick={() => navigate(`/group/${group.id}`)}
            />
          ))}

          <button
            className="add-group-btn"
            onClick={() => navigate("/crear-grup")}
          >
            + afegir nou grup
          </button>
        </section>
      </main>
    </>
  )
}