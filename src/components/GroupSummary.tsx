interface GroupSummaryProps {
  expenses: any[];
  participants: any[];
  currentUserId?: string | null;
}

type Balances = Record<string, number>;

// Funció auxiliar: Elimina decimals innecessaris i afegeix símbol d'euro
const formatAmount = (n: number) =>
  n.toFixed(2).replace(/\.00$/, "") + "€";

// Funció auxiliar: Arrodoneix un número a 2 decimals
const round2 = (n: number) =>
  Math.round(n * 100) / 100;

// Calcula quant ha pagat o deu cada participant
function calculateBalances(expenses: any[], participants: any[]): Balances {
  const balances: Balances = {};

  participants.forEach(p => {
    balances[p.id] = 0;
  });

  expenses.forEach(exp => {
    const amount = Number(exp.amount || 0);
    const splitBetween: string[] = Array.isArray(exp.splitBetween) ? exp.splitBetween : [];
    const perPerson = splitBetween.length ? amount / splitBetween.length : 0;

    splitBetween.forEach(id => {
      balances[id] = (balances[id] ?? 0) - perPerson;
    });

    const payer = exp.paidBy;
    balances[payer] = (balances[payer] ?? 0) + amount;
  });

  return balances;
}

// Genera les transferències per saldar els deutes
function generateSettlements(balances: Balances) {
  const entries = Object.entries(balances).map(([id, amount]) => ({
    id,
    amount: round2(amount),
  }));

  const creditors = entries.filter(e => e.amount > 0).sort((a, b) => b.amount - a.amount);
  const debtors = entries.filter(e => e.amount < 0).sort((a, b) => a.amount - b.amount);

  const transfers: Array<{ fromId: string; toId: string; amount: number }> = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amount = round2(Math.min(Math.abs(debtor.amount), creditor.amount));
    if (amount <= 0) break;

    transfers.push({
      fromId: debtor.id,
      toId: creditor.id,
      amount,
    });

    debtor.amount += amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 0.005) d++;
    if (Math.abs(creditor.amount) < 0.005) c++;
  }

  return transfers;
}

// Retorna el nom que s’ha de mostrar per a un participant
function displayName(p: any, id: string, currentUserId?: string | null) {
  const baseName = p.name || p.nombre;
  if (id === currentUserId) return baseName ? `Tu (${baseName})` : "Tu";
  return baseName || `Participant (${id})`;
}

// Component principal: mostra el resum del grup
export default function GroupSummary({
  expenses,
  participants,
  currentUserId,
}: GroupSummaryProps) {

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const balances = calculateBalances(expenses, participants);
  const settlements =
    participants.length > 2 ? generateSettlements(balances) : [];

  return (
    <div className="group-summary">
      <div className="summary-total">
        <strong>Total:</strong>
        <span>{formatAmount(total)}</span>
      </div>

      <div className="summary-balances">
        {participants.map(p => {
          const bal = balances[p.id] ?? 0;
          const abs = Math.abs(bal);
          const name = p.id === currentUserId ? "Tu" : (p.name || p.nombre || "Desconegut");

          return (
            <div
              key={p.id}
              className={`summary-line ${bal > 0 ? "positive" : bal < 0 ? "negative" : "zero"}`}
            >
              <span className="summary-name">{name}</span>
              <span className="summary-amount">
                {bal > 0 && `Ha de rebre ${formatAmount(abs)}`}
                {bal < 0 && `Deu ${formatAmount(abs)}`}
                {bal === 0 && "OK"}
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
              const fromP = participants.find(p => p.id === t.fromId);
              const toP = participants.find(p => p.id === t.toId);

              return (
                <div key={idx} className="transfer-line">
                  <span className="transfer-desc">
                    {displayName(fromP, t.fromId, currentUserId)} →{" "}
                    {displayName(toP, t.toId, currentUserId)}
                  </span>
                  <span className="transfer-amount">
                    {formatAmount(t.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
