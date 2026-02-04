import type { Participant } from "../hooks/useCreateGroup";

interface ParticipantsListProps {
  participants: Participant[];
  onRemove: (id: string) => void;
}

export function ParticipantsList({ participants, onRemove }: ParticipantsListProps) {
  return (
    <div className="participants-list">
      <h3>Participants ({participants.length})</h3>
      {participants.map((p) => (
        <div key={p.id} className="participant-item">
          <span>{p.name}</span>
          <button onClick={() => onRemove(p.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}