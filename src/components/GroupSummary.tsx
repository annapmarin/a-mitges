interface GroupSummaryProps {
  expenses: any[];
  participants: any[];
  currentUserId?: string | null;
}

const formatAmount = (n: number) => {
  return n.toFixed(2).replace(/\.00$/, "") + "€";
};

export default function GroupSummary({ expenses, participants, currentUserId }: GroupSummaryProps) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balances: Record<string, number> = {};
  participants.forEach((p) => {
    balances[p.id] = 0;
  });

  expenses.forEach((exp) => {
    const amount = Number(exp.amount || 0);
    const splitBetween: string[] = Array.isArray(exp.splitBetween) ? exp.splitBetween : [];
    const perShare = splitBetween.length ? amount / splitBetween.length : 0;

    splitBetween.forEach((id) => {
      if (!(id in balances)) balances[id] = 0;
      balances[id] -= perShare;
    });

    const payer = exp.paidBy;
    if (!(payer in balances)) balances[payer] = 0;
    balances[payer] += amount;
  });


  const generateSettlements = () => {
    const entries = Object.keys(balances).map((id) => ({ id, amount: Math.round((balances[id] || 0) * 100) / 100 }));

    const creditors = entries.filter(e => e.amount > 0).sort((a, b) => b.amount - a.amount);
    const debtors = entries.filter(e => e.amount < 0).sort((a, b) => a.amount - b.amount);

    const transfers: Array<{ fromId: string; toId: string; amount: number }> = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const debt = Math.abs(debtor.amount);
      const credit = creditor.amount;
      const transferAmountCents = Math.min(Math.round(debt * 100), Math.round(credit * 100));
      const transferAmount = Math.round(transferAmountCents) / 100;

      if (transferAmount <= 0) break;

      transfers.push({ fromId: debtor.id, toId: creditor.id, amount: transferAmount });

      debtor.amount += transferAmount;
      creditor.amount -= transferAmount;

      if (Math.abs(debtor.amount) < 0.005) i++;
      if (Math.abs(creditor.amount) < 0.005) j++;
    }

    return transfers;
  };

  const settlements = participants.length > 2 ? generateSettlements() : [];

  return (
    <div className="group-summary">
      <div className="summary-total">
        <strong>Total:</strong>
        <span>{formatAmount(total)}</span>
      </div>

      <div className="summary-balances">
        {participants.map((p) => {
          const id = p.id;
          const name = id === currentUserId ? "Tu" : (p.name || p.nombre || "Desconegut");
          const bal = balances[id] ?? 0;
          const abs = Math.abs(bal);
          return (
            <div key={id} className={`summary-line ${bal > 0 ? "positive" : bal < 0 ? "negative" : "zero"}`}>
              <span className="summary-name">{name}</span>
              <span className="summary-amount">
                {bal > 0 ? `Ha de rebre ${formatAmount(abs)}` : bal < 0 ? `Deu ${formatAmount(abs)}` : `OK`}
              </span>
            </div>
          );
        })}
      </div>

      {participants.length > 2 && (
        <div className="summary-settlements">
          <h3>Propostes de pagament</h3>
          {settlements.length === 0 ? (
            <p>Cap transferència necessària</p>
          ) : (
            settlements.map((t, idx) => {
              const fromP = participants.find(p => p.id === t.fromId) || { name: null, nombre: null };
              const toP = participants.find(p => p.id === t.toId) || { name: null, nombre: null };
              const fromDisplay = fromP.name || fromP.nombre || null;
              const toDisplay = toP.name || toP.nombre || null;
              const fromName = t.fromId === currentUserId ? (fromDisplay ? `Tu (${fromDisplay})` : `Tu`) : (fromDisplay || `Participant (${t.fromId})`);
              const toName = t.toId === currentUserId ? (toDisplay ? `Tu (${toDisplay})` : `Tu`) : (toDisplay || `Participant (${t.toId})`);
              return (
                <div key={idx} className="transfer-line">
                  <span className="transfer-desc">{fromName} → {toName}</span>
                  <span className="transfer-amount">{formatAmount(t.amount)}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
