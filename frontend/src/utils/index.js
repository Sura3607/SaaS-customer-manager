export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString()
}

export function formatPhone(num) {
  if (!num) return ''
  const s = String(num).replace(/\D/g, '')
  if (s.length === 10) return s.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  return num
}

export default { formatDate, formatPhone }
