import '../styles/button.css'

type buttonProps = {
  label: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

export function Button({ label, onClick, disabled = false, fullWidth = false}: buttonProps) {
  return (
    <button
      className={`button-primary ${fullWidth ? 'full-width' : ''}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}