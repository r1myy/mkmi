import type { Field } from 'payload'

type Json = Record<string, unknown>

/** Construit l’objet des valeurs par défaut d’une liste de champs Payload (onglets, rangées, groupes). */
export function extractDefaults(fields: Field[]): Json {
  const out: Json = {}
  for (const field of fields) {
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('name' in tab && tab.name) out[tab.name] = extractDefaults(tab.fields)
        else Object.assign(out, extractDefaults(tab.fields))
      }
    } else if (field.type === 'row' || field.type === 'collapsible') {
      Object.assign(out, extractDefaults(field.fields))
    } else if (field.type === 'group' && 'name' in field) {
      out[field.name] = extractDefaults(field.fields)
    } else if ('name' in field && 'defaultValue' in field && typeof field.defaultValue !== 'function') {
      out[field.name] = field.defaultValue
    }
  }
  return out
}

/** Complète les valeurs vides enregistrées avec les valeurs par défaut. */
export function withDefaults<T>(value: unknown, defaults: unknown): T {
  const isEmpty = value === null || value === undefined || (Array.isArray(value) && value.length === 0)
  if (isEmpty) return defaults as T
  if (
    defaults &&
    typeof defaults === 'object' &&
    !Array.isArray(defaults) &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {
    const merged: Json = { ...(value as Json) }
    for (const [key, def] of Object.entries(defaults as Json)) {
      merged[key] = withDefaults((value as Json)[key], def)
    }
    return merged as T
  }
  return value as T
}
