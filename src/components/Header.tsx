import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(128,0,32,0.12)',
        background: 'rgba(250,248,249,0.9)',
        backdropFilter: 'blur(12px)',
        padding: '0 1rem',
      }}
    >
      <nav
        className="page-wrap"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          paddingBottom: '0.85rem',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'var(--burgundy)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
          }}
        >
          Lista de Presentes
        </Link>

        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--ink-faint)',
          }}
        >
          2026
        </span>
      </nav>
    </header>
  )
}
