import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useGroupDetails } from "../hooks/useGroupDetails";
import { useCreateExpense } from "../hooks/useCreateExpense";
import { Navbar } from "../components/Navbar";
import { ParticipantSelector } from "../components/ParticipantSelector";
import "../styles/add-expense.css";

export default function AddExpensePage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { participants, loading: loadingGroup } = useGroupDetails(groupId);
  const navigate = useNavigate();
  
  const {
    description,
    setDescription,
    amount,
    setAmount,
    paidBy,
    setPaidBy,
    splitBetween,
    toggleParticipant,
    initializeDefaults,
    handleCreateExpense,
    loading
  } = useCreateExpense(groupId);

  useEffect(() => {
    if (participants.length > 0 && user) {
      initializeDefaults(participants, user.uid);
    }
  }, [participants, user]);

  if (loadingGroup) return <div>Carregant...</div>;

  return (
    <>
      {user && <Navbar user={user} />}
      <div className="add-expense-page">
        <button className="back-btn" onClick={() => navigate(`/group/${groupId}`)}>
          ← Tornar
        </button>

        <h1>Afegir despesa</h1>

        <div className="form-group">
          <label>Concepte</label>
          <input
            type="text"
            placeholder="Breu descripció de la despesa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Quantitat (€)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Pagat per</label>
          <select 
            value={paidBy} 
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Selecciona un participant</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id && user?.uid && p.id === user.uid ? "Tu" : p.name}
              </option>
            ))}
          </select>
        </div>

        <ParticipantSelector
          participants={participants}
          selectedIds={splitBetween}
          onToggle={toggleParticipant}
          label="Dividir entre"
          currentUserId={user?.uid}
        />

        <button 
          className="create-expense-btn"
          onClick={handleCreateExpense}
          disabled={loading}
        >
          {loading ? "Creant..." : "Crear despesa"}
        </button>
      </div>
    </>
  );
}