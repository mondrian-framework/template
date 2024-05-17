/**
 * Adds id to the selection
 */
export function addIdToSelection<T>(select: T): T & { readonly id: true } {
  return addFieldToSelection(select, { id: true })
}

export function addFieldToSelection<T, const P>(select: T, fields: P): T & P {
  if (select === undefined) {
    return undefined as unknown as T & P //the fields are already included
  } else {
    return { ...select, ...fields }
  }
}
