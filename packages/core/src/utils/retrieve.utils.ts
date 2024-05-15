export function addIdToSelection<T>(select: T): T & { readonly id: true } {
  return addFieldToSelection(select, { id: true })
}

export function addFieldToSelection<T, const P>(select: T, fields: P): T & P {
  if (select === undefined) {
    return undefined as unknown as T & P
  } else {
    return { ...select, ...fields }
  }
}
