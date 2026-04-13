export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '4rem',
        borderTop: '1px solid rgba(128,0,32,0.1)',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          fontWeight: 500,
        }}
      >
        Lista de presentes · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
