interface ParticipantSelectorProps {
  participants: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  label: string;
}

export function ParticipantSelector({ 
  participants, 
  selectedIds, 
  onToggle,
  label 
}: ParticipantSelectorProps) {
  return (
    <div className="participant-selector">
      <h3>{label}</h3>
      <div className="participants-checkboxes">
        {participants.map((participant) => (
          <label key={participant.id} className="participant-checkbox">
            <input
              type="checkbox"
              checked={selectedIds.includes(participant.id)}
              onChange={() => onToggle(participant.id)}
            />
            <span>{participant.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}