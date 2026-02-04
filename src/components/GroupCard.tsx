import "../styles/projects-page.css"

interface GroupCardProps {
  group: any;
  color: string;
  onClick: () => void;
}

export function GroupCard({ group, color, onClick }: GroupCardProps) {
  return (
    <button
      className="group-card"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {group.name}
    </button>
  )
}