import { Fragment } from 'react'

/**
 * Affiche un texte saisi dans l’éditeur de pages :
 * les mots entre *astérisques* passent en or et chaque retour à la ligne crée une nouvelle ligne.
 */
export function Rich({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
              <span key={j} className="text-gold-400">
                {part.slice(1, -1)}
              </span>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </span>
  )
}

/** Version texte brut (métadonnées, attributs). */
export const plain = (text?: string | null) => (text ?? '').replace(/\*/g, '').replace(/\s*\n\s*/g, ' ').trim()
