import '../styles/button.css'

type buttonProps = {
  label: string
  onClick?: () => void
  disabled?: boolean
}

export function Button({ label, onClick, disabled = false }: buttonProps) {
  return (
    <button
      className="button-primary"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}