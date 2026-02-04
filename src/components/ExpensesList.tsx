import { deleteExpense } from "../services/expenseService";

interface ExpensesListProps {
  expenses: any[];
  participants: any[];
  onExpenseDeleted?: () => void;
}

export function ExpensesList({ expenses, participants, onExpenseDeleted }: ExpensesListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Segur que vols eliminar aquesta despesa?")) return;
    try {
      await deleteExpense(id);
      onExpenseDeleted?.();
    } catch (err) {
      alert("Error eliminant la despesa");
    }
  };

  const getParticipantName = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.name || "Desconegut";
  };

  return (
    <div className="expenses-list">
      <h2>Despeses</h2>
      {expenses.length === 0 ? (
        <p>No hi ha despeses encara</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-header">
              <h3>{expense.description}</h3>
              <span className="expense-amount">{expense.amount}€</span>
            </div>
            <div className="expense-details">
              <p>Pagat per: {getParticipantName(expense.paidBy)}</p>
              <p>Dividit entre: {(expense.splitBetween || []).map(getParticipantName).join(", ")}</p>
            </div>
            <button className="expense-delete-btn" onClick={() => handleDelete(expense.id)} aria-label="Eliminar despesa">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48" fill="#fff">
                <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6367188 13 L 11.15625 39.029297 C 11.43025 41.862297 13.785813 44 16.632812 44 L 31.367188 44 C 34.214187 44 36.56875 41.862297 36.84375 39.029297 L 39.363281 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 7 24 7 z M 19.5 18 C 20.328 18 21 18.671 21 19.5 L 21 34.5 C 21 35.329 20.328 36 19.5 36 C 18.672 36 18 35.329 18 34.5 L 18 19.5 C 18 18.671 18.672 18 19.5 18 z M 28.5 18 C 29.328 18 30 18.671 30 19.5 L 30 34.5 C 30 35.329 29.328 36 28.5 36 C 27.672 36 27 35.329 27 34.5 L 27 19.5 C 27 18.671 27.672 18 28.5 18 z"></path>
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}