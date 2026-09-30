'use client'

/** Encadré d’aide affiché dans l’éditeur de pages. */
export function HelpText({ text }: { text?: string }) {
  if (!text) return null
  return (
    <p
      style={{
        margin: '0 0 1.5rem',
        padding: '12px 14px',
        borderRadius: 8,
        background: 'var(--theme-elevation-50)',
        borderLeft: '3px solid #f5bf4f',
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      {text}
    </p>
  )
}
