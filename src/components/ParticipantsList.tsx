import type { Participant } from "../hooks/useCreateGroup";

interface ParticipantsListProps {
  participants: Participant[];
  onRemove: (id: string) => void;
  currentUserId?: string | null;
}

export function ParticipantsList({ participants, onRemove, currentUserId }: ParticipantsListProps) {
  return (
    <div className="participants-list">
      <h3>Participants ({participants.length})</h3>
      {participants.map((p) => (
        <div key={p.id} className="participant-item">
          <span>{p.id && currentUserId && p.id === currentUserId ? "Tu" : p.name}</span>
          <button onClick={() => onRemove(p.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}