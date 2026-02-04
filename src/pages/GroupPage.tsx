import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useGroupDetails } from "../hooks/useGroupDetails";
import { Navbar } from "../components/Navbar";
import { ExpensesList } from "../components/ExpensesList";
import "../styles/group-detail.css";

export default function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { participants, expenses, loading } = useGroupDetails(groupId);
  const navigate = useNavigate();

  if (loading) return <div>Carregant...</div>;

  return (
    <>
      {user && <Navbar user={user} />}
      <div className="group-page">
        <button 
          className="add-expense-btn"
          onClick={() => navigate(`/group/${groupId}/afegir-despesa`)}
        >
          + Afegir despesa
        </button>

        <ExpensesList expenses={expenses} participants={participants} />
      </div>
    </>
  );
}