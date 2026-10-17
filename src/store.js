// Serversiz ma'lumotlar ombori: hammasi brauzer localStorage'da saqlanadi (Ctrl+R qilganda ham o'chmaydi).
import { FIELDS } from './data/fields.js'
const K = 'maydon_db_v3'
const demo = [
  { id: 1, name: 'Mijoz 1', phone: '900000001', password: 'demo123', role: 'customer1' },
  { id: 2, name: 'Maydon egasi', phone: '900000002', password: 'demo123', role: 'owner' },
  { id: 3, name: 'Mijoz 2', phone: '900000003', password: 'demo123', role: 'customer2' },
]
const rd = (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
export const save = (d) => { try { localStorage.setItem(K, JSON.stringify(d)) } catch { alert("Xotira to'ldi: rasm hajmi katta bo'lishi mumkin") } }
export const load = () => {
  const d = rd(K)
  if (d) return { ...d, edits: d.edits || {}, fields: [...d.fields.filter((f) => f.id > 1000), ...FIELDS.map((f) => ({ ...f, ...(d.edits?.[f.id] || {}) }))] }
  const old = rd('maydon_db_v2') || rd('maydon_db') || {}
  const users = (old.users || []).map((u) => ({ ...u, role: u.role === 'customer' ? 'customer1' : u.role }))
  demo.forEach((u) => { if (!users.some((x) => x.phone === u.phone)) users.push(u) })
  const mine = (old.fields || []).filter((f) => f.id > 1000)
  const all = [...FIELDS, ...mine]
  const bookings = (old.bookings || []).filter((b) => /^20\d\d-/.test(b.date)).map((b) => ({
    ...b, hours: b.hours || 1, status: b.status === 'tasdiqlandi' ? 'qabul' : b.status,
    total: b.total ?? (all.find((f) => f.id === b.fieldId)?.price || 0),
  }))
  const n = { users, edits: {}, fields: [...mine, ...FIELDS], bookings }
  save(n)
  return n
}
export const getMe = () => rd('maydon_me')
export const setMe = (id) => (id ? localStorage.setItem('maydon_me', JSON.stringify(id)) : localStorage.removeItem('maydon_me'))
