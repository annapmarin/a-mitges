import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useGroupDetails } from "../hooks/useGroupDetails";
import { deleteGroup } from "../services/groupService";
import { Navbar } from "../components/Navbar";
import { ExpensesList } from "../components/ExpensesList";
import "../styles/group-detail.css";

export default function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { participants, expenses, loading, groupName, refetch } = useGroupDetails(groupId);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteGroup = async () => {
    if (confirmText !== "Eliminar" || !groupId) return;
    
    try {
      setDeleting(true);
      await deleteGroup(groupId);
      navigate("/projectes");
    } catch (error) {
      console.error("Error eliminant grup:", error);
      alert("Error eliminant el grup");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Carregant...</div>;

  return (
    <>
      {user && <Navbar user={user} />}
      <div className="group-page">
        <button className="back-btn" onClick={() => navigate("/projectes")}>
          ← Tornar
        </button>
        {/* Nom del grup */}
        <h1>{groupName}</h1>
        <button 
          className="add-expense-btn"
          onClick={() => navigate(`/group/${groupId}/afegir-despesa`)}
        >
          + Afegir despesa
        </button>

        <ExpensesList
          expenses={expenses}
          participants={participants}
          onExpenseDeleted={() => refetch()}
        />

        <button 
          className="delete-group-btn"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar grup
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Eliminar grup</h2>
            <p>Aquesta acció no es pot desfer. Escriu "Eliminar" per confirmar:</p>
            
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Escriu 'Eliminar'"
              className="confirm-input"
            />

            <div className="modal-buttons">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
              >
                Cancel·lar
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDeleteGroup}
                disabled={confirmText !== "Eliminar" || deleting}
              >
                {deleting ? "Eliminant..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}