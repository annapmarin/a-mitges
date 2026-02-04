interface ExpensesListProps {
  expenses: any[];
  participants: any[];
}

export function ExpensesList({ expenses, participants }: ExpensesListProps) {
  const getParticipantName = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.nombre || "Desconegut";
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
              <p>Dividit entre: {expense.divideAmong.map(getParticipantName).join(", ")}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}