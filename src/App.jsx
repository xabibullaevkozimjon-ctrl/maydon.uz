import { useEffect, useState } from 'react'
import { Trophy, User, Building2, MapPin, LogOut, Search, Plus, Trash2, ImagePlus, Clock, Phone, Wallet, Inbox, LayoutGrid, CalendarCheck, ClipboardList, ArrowLeft, Eye, EyeOff, Pencil, X } from './icons.jsx'
import { load, save, getMe, setMe } from './store.js'

const som = (n) => Number(n || 0).toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm"
const pad = (n) => String(n).padStart(2, '0')
const ds = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const todayStr = () => ds(new Date())
const days = (n) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d })
const WD = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
const MO = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']
const dLabel = (s) => { const [, m, d] = s.split('-').map(Number); return `${d}-${MO[m - 1]}` }
const rng = (b) => `${pad(b.hour)}:00–${pad(b.hour + b.hours)}:00`
const HOURS = Array.from({ length: 16 }, (_, i) => i + 8)
const FALLBACK = 'img/default.jpg'
const ROLE = { customer1: 'Buyurtma beruvchi 1', customer2: 'Buyurtma beruvchi 2', owner: 'Qabul qiluvchi' }
const ST = {
  kutilmoqda: ['Kutilmoqda', 'bg-blue-500/20 text-blue-200 border border-blue-400/40'],
  qabul: ['Qabul qilindi', 'bg-green-500/20 text-green-300 border border-green-400/40'],
  yakunlandi: ['Yakunlandi', 'bg-black text-white border border-slate-500'],
  rad: ['Rad etildi', 'bg-red-500/20 text-red-300 border border-red-400/40'],
}
// Barcha tugmalar: yashil fon, oq yozuv
const gb = (on) => (on ? 'bg-green-800 ring-2 ring-white text-white font-bold' : 'bg-green-600 hover:bg-green-700 text-white font-bold') + ' transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
const BG = { backgroundImage: 'linear-gradient(rgba(3,8,22,.9),rgba(5,16,45,.96)),url(img/bg-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
const Badge = ({ s }) => <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${ST[s][1]}`}>{ST[s][0]}</span>
const Img = ({ src, className = '' }) => (
  <img src={src || FALLBACK} alt="" loading="lazy" className={`object-cover ${className}`}
    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK }} />
)
const inp = 'w-full rounded-lg bg-[#071433] text-white placeholder:text-blue-300 border border-blue-700 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition'
const card = 'bg-[#0d1f4d]/90 rounded-xl border border-blue-800/70 shadow-lg shadow-black/30 backdrop-blur-sm text-white'
const toDataUrl = (file, max = 800) => new Promise((res) => {
  const r = new FileReader()
  r.onload = () => {
    const im = new Image()
    im.onload = () => {
      const s = Math.min(1, max / im.width), c = document.createElement('canvas')
      c.width = im.width * s; c.height = im.height * s
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    im.src = r.result
  }
  r.readAsDataURL(file)
})
// Sahifani yangilaganda (Ctrl+R) tanlangan bo'lim, maydon va sana saqlanib qoladi
const usePersist = (key, init, session = false) => {
  const st = () => (session ? sessionStorage : localStorage)
  const [v, setV] = useState(() => { try { const r = st().getItem('maydon_ui_' + key); return r === null ? init : JSON.parse(r) } catch { return init } })
  const set = (x) => { setV(x); try { st().setItem('maydon_ui_' + key, JSON.stringify(x)) } catch {} }
  return [v, set]
}
const clearAuthUi = () => { try { sessionStorage.removeItem('maydon_ui_auth_role'); sessionStorage.removeItem('maydon_ui_auth_tab') } catch {} }
const Tabs = ({ tabs, tab, set }) => (
  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}>
    {tabs.map(([k, t, I, n]) => (
      <button key={k} onClick={() => { set(k); window.scrollTo({ top: 0 }) }}
        className={`relative py-3 rounded-lg text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${gb(tab === k)}`}>
        <I size={18} /><span>{t}</span>
        {n > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white animate-pulse">{n}</span>}
      </button>
    ))}
  </div>
)
const Hero = ({ title, sub, children }) => (
  <section className="text-white anim-fade" style={{ backgroundImage: "linear-gradient(rgba(4,12,32,.72),rgba(4,12,32,.92)),url(img/bg-hero.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-5">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">{title}</h1>
      <p className="text-blue-100 mt-2 mb-6 max-w-xl">{sub}</p>
      {children}
    </div>
  </section>
)

const Pw = ({ value, onChange, placeholder = 'Parol' }) => {
  const [s, setS] = useState(false)
  return (
    <div className="relative">
      <input className={inp + ' pr-14'} type={s ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" onClick={() => setS(!s)} aria-label="Parolni ko'rsatish" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white">{s ? <EyeOff size={16} /> : <Eye size={16} />}</button>
    </div>
  )
}
const Avatar = ({ u, size = 36 }) => (
  u?.avatar
    ? <img src={u.avatar} alt="" style={{ width: size, height: size }} className="rounded-full object-cover border-2 border-white" />
    : <div style={{ width: size, height: size }} className="rounded-full bg-green-700 text-white flex items-center justify-center border-2 border-white"><User size={size * 0.55} /></div>
)

export default function App() {
  const [db, setDb] = useState(load)
  const [meId, setMeId] = useState(getMe)
  const [prof, setProf] = useState(false)
  // Har safar eng yangi ma'lumot ustiga yoziladi (boshqa oynadagi o'zgarishlar yo'qolmaydi)
  const upd = (f) => setDb(() => { save(f(load())); return load() })
  useEffect(() => {
    const h = () => setDb((prev) => { const n = load(); return JSON.stringify(n) === JSON.stringify(prev) ? prev : n })
    window.addEventListener('storage', h)
    window.addEventListener('focus', h)
    return () => { window.removeEventListener('storage', h); window.removeEventListener('focus', h) }
  }, [])
  const me = db.users.find((u) => u.id === meId)
  const login = (id) => { clearAuthUi(); setMe(id); setMeId(id) }
  const logout = () => { clearAuthUi(); setMe(null); setMeId(null); setProf(false) }
  if (!me) return <Auth db={db} upd={upd} onLogin={login} />
  const owner = me.role === 'owner'
  return (
    <div className="min-h-screen text-white" style={BG}>
      <header className="bg-black text-white border-b-4 border-red-600 anim-down">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center"><Trophy size={22} /></div>
            <div className="text-2xl font-black tracking-tight">Maydon<span className="text-green-500">.uz</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setProf(true)} className={`rounded-lg pl-1 pr-3 py-1 flex items-center gap-2 ${gb(false)}`}>
              <Avatar u={me} size={34} />
              <span className="text-left text-xs leading-tight"><span className="block font-bold max-w-[7rem] truncate">{me.name}</span><span className="block font-normal opacity-90 hidden sm:block">{ROLE[me.role]} · Profil</span></span>
            </button>
            <button onClick={logout} className={`rounded-lg px-3 py-2 flex items-center gap-2 ${gb(false)}`}><LogOut size={16} /><span className="hidden sm:inline">Chiqish</span></button>
          </div>
        </div>
      </header>
      {owner ? <Owner db={db} upd={upd} me={me} /> : <Customer db={db} upd={upd} me={me} />}
      {prof && <Profile me={me} upd={upd} onClose={() => setProf(false)} />}
    </div>
  )
}

function Profile({ me, upd, onClose }) {
  const [f, setF] = useState({ name: me.name, phone: me.phone, password: me.password, avatar: me.avatar || '' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const pick = async (e) => { const file = e.target.files?.[0]; if (file) setF({ ...f, avatar: await toDataUrl(file, 300) }) }
  const submit = () => {
    setErr(''); setOk('')
    if (f.name.trim().length < 2) return setErr('Ismingizni kiriting')
    if (!/^\d{9}$/.test(f.phone)) return setErr("Telefon raqam 9 ta raqamdan iborat bo'lsin")
    if (f.password.length < 4) return setErr("Parol kamida 4 belgi bo'lsin")
    if (load().users.some((u) => u.id !== me.id && u.phone === f.phone)) return setErr('Bu raqam boshqa foydalanuvchida bor')
    upd((p) => ({ ...p, users: p.users.map((u) => (u.id === me.id ? { ...u, name: f.name.trim(), phone: f.phone, password: f.password, avatar: f.avatar } : u)) }))
    setOk('Saqlandi')
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 anim-fade" onClick={onClose}>
      <div className="bg-[#0b1a3d] text-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5 border-t-4 border-red-600 anim-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-white">Profil</h2>
          <button onClick={onClose} className={`p-2 rounded-lg ${gb(false)}`} aria-label="Yopish"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Avatar u={{ avatar: f.avatar }} size={80} />
          <div className="space-y-2">
            <label className={`cursor-pointer inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${gb(false)}`}><ImagePlus size={16} />Rasm tanlash<input type="file" accept="image/*" className="hidden" onChange={pick} /></label>
            {f.avatar && <button onClick={() => setF({ ...f, avatar: '' })} className={`block text-sm rounded-lg px-3 py-2 ${gb(false)}`}>Rasmni olib tashlash</button>}
          </div>
        </div>
        <div className="text-sm text-blue-200 mb-3">Rol: <b>{ROLE[me.role]}</b></div>
        <div className="space-y-3">
          <div><div className="text-sm font-bold mb-1">Ism</div><input className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><div className="text-sm font-bold mb-1">Telefon raqam</div><input className={inp} inputMode="numeric" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <div><div className="text-sm font-bold mb-1">Parol</div><Pw value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        </div>
        {err && <div className="mt-3 rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm">{err}</div>}
        {ok && <div className="mt-3 rounded-lg bg-green-950/70 text-green-300 border border-green-800 px-4 py-3 text-sm">{ok}</div>}
        <button onClick={submit} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Saqlash</button>
      </div>
    </div>
  )
}

const PICK = [
  ['customer1', User, "Maydonni band qilaman"],
  ['customer2', User, "Maydonni band qilaman"],
  ['owner', Building2, "Maydonlarimni boshqaraman"],
]
const DEMO = { customer1: '900000001', customer2: '900000003', owner: '900000002' }

function Auth({ db, upd, onLogin }) {
  const [role, setRole] = usePersist('auth_role', null, true)
  const [tab, setTab] = usePersist('auth_tab', 'reg', true)
  const [f, setF] = useState({ name: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [foc, setFoc] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const sug = tab === 'login' && foc && f.phone ? db.users.filter((u) => u.role === role && u.phone.startsWith(f.phone) && u.phone !== f.phone).slice(0, 5) : []
  const register = () => {
    setErr(''); setOk('')
    if (f.name.trim().length < 2) return setErr('Ismingizni kiriting')
    if (!/^\d{9}$/.test(f.phone)) return setErr("Telefon raqam 9 ta raqamdan iborat bo'lsin (masalan 901234567)")
    if (f.password.length < 4) return setErr("Parol kamida 4 belgi bo'lsin")
    if (load().users.some((u) => u.phone === f.phone)) return setErr("Bu raqam allaqachon ro'yxatdan o'tgan")
    upd((p) => ({ ...p, users: [...p.users, { id: Date.now(), name: f.name.trim(), phone: f.phone, password: f.password, role }] }))
    setOk("Ro'yxatdan o'tdingiz! Endi parolingiz bilan kiring.")
    setF({ name: '', phone: f.phone, password: '' }); setTab('login')
  }
  const enter = () => {
    setErr(''); setOk('')
    const u = load().users.find((x) => x.phone === f.phone && x.password === f.password)
    if (!u) return setErr("Telefon raqam yoki parol noto'g'ri")
    if (u.role !== role) return setErr(`Bu raqam "${ROLE[u.role]}" sifatida ro'yxatdan o'tgan. Rolni o'zgartirib qayta kiring.`)
    onLogin(u.id)
  }
  const back = () => { setRole(null); setErr(''); setOk(''); setF({ name: '', phone: '', password: '' }); setTab('reg') }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 anim-fade" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.55),rgba(4,12,32,.75)),url(img/bg-login.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-md bg-[#0b1a3d]/95 text-white rounded-2xl p-6 shadow-2xl border-t-4 border-red-600 anim-pop">
        <div className="text-center mb-5">
          <div className="mx-auto w-16 h-16 rounded-xl bg-black flex items-center justify-center"><Trophy className="text-green-500" size={32} /></div>
          <h1 className="text-3xl font-black text-white mt-2">Maydon<span className="text-green-600">.uz</span></h1>
          <p className="text-blue-200">Stadion va futbol maydonlarini onlayn band qiling</p>
        </div>
        <div key={role ? 'form' + tab : 'pick'} className="anim-fade">
        {!role ? (
          <>
            <p className="text-center font-black text-lg text-white mb-3">Saytga kim bo'lib kirmoqchisiz?</p>
            <div className="space-y-3">
              {PICK.map(([k, I, d], i) => (
                <button key={k} onClick={() => setRole(k)} style={{ animationDelay: `${i * 90}ms` }} className={`w-full py-4 px-5 rounded-xl flex items-center gap-4 text-left anim-up ${gb(false)}`}>
                  <I size={28} /><span><span className="block text-lg">{ROLE[k]}</span><span className="block text-sm font-normal opacity-90">{d}</span></span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 rounded-lg bg-blue-950/80 px-3 py-2">
              <span className="font-bold text-white">{ROLE[role]}</span>
              <button onClick={back} className={`px-3 py-1 rounded-lg text-sm ${gb(false)}`}>O'zgartirish</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[['reg', "Ro'yxatdan o'tish"], ['login', 'Kirish']].map(([k, t]) => (
                <button key={k} onClick={() => { setTab(k); setErr(''); setOk('') }} className={`py-3 rounded-lg ${gb(tab === k)}`}>{t}</button>
              ))}
            </div>
            <div className="space-y-3">
              {tab === 'reg' && <input className={inp} placeholder="Ism" value={f.name} onChange={set('name')} />}
              <div className="relative">
                <input className={inp} placeholder="Telefon (9 raqam)" inputMode="numeric" value={f.phone} onChange={set('phone')} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)} autoComplete="off" />
                {sug.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl border border-green-700">
                    {sug.map((u) => (
                      <button key={u.id} onMouseDown={(e) => { e.preventDefault(); setF({ ...f, phone: u.phone }); setFoc(false) }} className="w-full text-left px-3 py-2 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white">
                        <Avatar u={u} size={28} /><span><b>{u.phone}</b> <span className="text-sm opacity-90">{u.name}</span></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Pw value={f.password} onChange={set('password')} />
            </div>
            {err && <div className="mt-3 rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm">{err}</div>}
            {ok && <div className="mt-3 rounded-lg bg-green-950/70 text-green-300 border border-green-800 px-4 py-3 text-sm">{ok}</div>}
            {tab === 'reg'
              ? <button onClick={register} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Ro'yxatdan o'tish</button>
              : (
                <>
                  <button onClick={enter} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Kirish</button>
                  <p className="text-xs text-blue-300 mt-3">Demo: {DEMO[role]}, parol demo123. Raqamning birinchi raqamlarini yozsangiz, ro'yxatdan o'tgan raqamlar chiqadi.</p>
                </>
              )}
          </>
        )}
        </div>
      </div>
    </div>
  )
}

function Customer({ db, upd, me }) {
  const [tab, setTab] = usePersist(`c${me.id}_tab`, 'fields')
  const [fid, setFid] = usePersist(`c${me.id}_fid`, null)
  const [date0, setDate] = usePersist(`c${me.id}_date`, todayStr())
  const date = date0 < todayStr() ? todayStr() : date0
  const [dur, setDur] = usePersist(`c${me.id}_dur`, 1)
  const [start, setStart] = useState(null)
  const [msg, setMsg] = useState('')
  const [hl, setHl] = useState(null)
  const [q, setQ] = useState('')
  const field = db.fields.find((x) => x.id === fid)
  const nowH = new Date().getHours()
  const live = (b) => b.status !== 'rad'
  const at = (h) => db.bookings.find((b) => b.fieldId === fid && b.date === date && live(b) && h >= b.hour && h < b.hour + b.hours)
  const past = (h) => date === todayStr() && h <= nowH
  const okStart = (h) => h + dur <= 24 && Array.from({ length: dur }, (_, i) => h + i).every((x) => !at(x) && !past(x))
  const picked = (h) => start !== null && h >= start && h < start + dur
  const ownerName = (x) => db.users.find((u) => u.id === x.ownerId)?.name || 'Maydon.uz'
  const list = db.fields.filter((x) => (x.name + ' ' + x.address).toLowerCase().includes(q.toLowerCase()))
  const mine = db.bookings.filter((b) => b.customerId === me.id).sort((a, b) => (b.at || 0) - (a.at || 0))
  const here = mine.filter((b) => b.fieldId === fid && live(b))
  const sum = mine.filter(live).reduce((s, b) => s + (b.total || 0), 0)
  const open = (x) => { setFid(x.id); setDate(todayStr()); setDur(1); setStart(null); setMsg(''); setHl(null); setTab('book'); window.scrollTo({ top: 0 }) }
  const cancel = (id) => upd((p) => ({ ...p, bookings: p.bookings.filter((x) => x.id !== id) }))
  const book = () => {
    const latest = load()
    const clash = latest.bookings.some((b) => b.fieldId === fid && b.date === date && live(b) && b.hour < start + dur && start < b.hour + b.hours)
    if (clash) { upd(() => latest); setStart(null); setMsg('Bu vaqt hozirgina boshqa mijoz tomonidan band qilindi. Boshqa vaqtni tanlang.'); return }
    const nb = { id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6), at: Date.now(), fieldId: fid, customerId: me.id, date, hour: start, hours: dur, total: field.price * dur, status: 'kutilmoqda' }
    upd((p) => ({ ...p, bookings: [...p.bookings, nb] }))
    setStart(null); setMsg(''); setTab('orders'); window.scrollTo({ top: 0 })
  }
  const hs = (h) => {
    const b = at(h)
    if (b) return b.customerId === me.id ? 'bg-blue-800 text-white ring-2 ring-white' : 'bg-slate-700 text-white line-through'
    if (past(h)) return 'bg-slate-800/70 text-blue-100 line-through'
    if (picked(h)) return 'bg-blue-900 text-white ring-2 ring-white'
    return okStart(h) ? gb(false) : 'bg-slate-900/60 text-blue-100'
  }
  return (
    <>
      <Hero title="Futbol maydonini onlayn band qiling" sub={`${db.fields.length} ta maydon. Sana va soatni tanlang, buyurtma bering, egasi tasdiqlaydi.`}>
        <Tabs tab={tab} set={setTab} tabs={[['fields', 'Maydonlar', LayoutGrid], ['book', 'Band qilish', CalendarCheck], ['orders', 'Buyurtmalarim', ClipboardList, mine.filter((b) => b.status === 'kutilmoqda').length]]} />
      </Hero>
      <main key={tab} className="max-w-5xl mx-auto p-4 anim-page">
        {tab === 'fields' && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-2xl font-black text-white">Maydonlar ({list.length})</h2>
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <input className={inp + ' pl-9'} placeholder="Nom yoki manzil bo'yicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
            {list.length === 0 && <p className="text-blue-200">Hech narsa topilmadi. Boshqa nom yoki tumanni yozib ko'ring.</p>}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {list.map((x, i) => (
                <div key={x.id} onClick={() => open(x)} style={{ animationDelay: `${(i % 12) * 45}ms` }} className={`${card} group anim-up overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-green-500 transition-all duration-300 flex flex-col`}>
                  <div className="relative overflow-hidden">
                    <Img src={x.img} className="w-full h-28 sm:h-32 transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">{som(x.price)} / soat</span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="font-extrabold text-white leading-tight">{x.name}</div>
                    <div className="text-xs text-blue-200 flex items-center gap-1 mt-1"><MapPin size={12} />{x.address}</div>
                    <div className="text-xs text-blue-300 mb-3">Egasi: {ownerName(x)}</div>
                    <button className={`mt-auto w-full py-2 rounded-lg text-sm ${gb(false)}`}>Band qilish</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === 'book' && !field && (
          <div className={`${card} p-8 text-center`}>
            <p className="text-blue-100 mb-4">Avval maydonni tanlang.</p>
            <button onClick={() => setTab('fields')} className={`px-5 py-3 rounded-lg ${gb(false)}`}>Maydonlarni ko'rish</button>
          </div>
        )}
        {tab === 'book' && field && (
          <section className={`${card} overflow-hidden`}>
            <Img src={field.img} className="w-full h-48 sm:h-72" />
            <div className="p-4 space-y-5">
              <button onClick={() => setTab('fields')} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${gb(false)}`}><ArrowLeft size={16} />Maydonlarga qaytish</button>
              <div>
                <h3 className="font-black text-2xl text-white">{field.name}</h3>
                <div className="text-blue-200 flex items-center gap-1"><MapPin size={14} />{field.address}</div>
                <div className="text-blue-200 text-sm">Egasi: {ownerName(field)}</div>
                <div className="font-black text-green-400 text-xl mt-1">{som(field.price)} / soat</div>
              </div>
              <div>
                <div className="font-bold mb-2">Sanani tanlang</div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days(14).map((d) => { const s = ds(d); return (
                    <button key={s} onClick={() => { setDate(s); setStart(null) }} className={`shrink-0 w-16 rounded-lg py-2 text-center ${date === s ? 'bg-blue-900 text-white ring-2 ring-white' : gb(false)}`}>
                      <div className="text-xs">{WD[d.getDay()]}</div><div className="text-xl font-black">{d.getDate()}</div><div className="text-xs">{MO[d.getMonth()]}</div>
                    </button>) })}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Necha soat o'ynaysiz?</div>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => { setDur(n); setStart(null) }} className={`px-4 py-2 rounded-lg ${dur === n ? 'bg-blue-900 text-white ring-2 ring-white font-bold' : gb(false)}`}>{n} soat</button>)}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Boshlanish vaqtini tanlang ({dLabel(date)})</div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {HOURS.map((h) => {
                    const b = at(h); const own = b && b.customerId === me.id
                    return (
                      <button key={h} disabled={b ? !own : !okStart(h)} onClick={() => (own ? setHl(b.id) : !b && setStart(h))} className={`py-2 rounded-lg font-bold text-sm leading-tight transition-transform hover:scale-105 disabled:hover:scale-100 ${hs(h)}`}>
                        {h}:00{b && <div className="text-[10px] font-normal no-underline">{own ? 'Sizniki' : 'Band'}</div>}
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-blue-200 mt-3">
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-green-600 inline-block" />Bo'sh</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-slate-700 inline-block" />Band (boshqa mijoz)</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-blue-800 inline-block" />Sizning buyurtmangiz</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-slate-700 inline-block" />O'tib ketgan</span>
                </div>
              </div>
              {here.length > 0 && (
                <div>
                  <div className="font-bold mb-2">Shu maydondagi buyurtmalaringiz</div>
                  <div className="space-y-2">
                    {here.map((b) => (
                      <div key={b.id} className={`rounded-lg border p-3 flex flex-wrap items-center justify-between gap-2 ${hl === b.id ? 'border-green-500 bg-blue-900/60' : 'border-blue-800/60'}`}>
                        <div className="text-sm"><b>{dLabel(b.date)}</b> · {rng(b)} · {b.hours} soat · <b className="text-green-400">{som(b.total)}</b></div>
                        <div className="flex items-center gap-2"><Badge s={b.status} />{b.status === 'kutilmoqda' && <button onClick={() => cancel(b.id)} className={`px-3 py-1 rounded-lg text-sm ${gb(false)}`}>Bekor qilish</button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {msg && <div className="rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm">{msg}</div>}
              {start !== null && (
                <div className="rounded-xl bg-blue-950/70 border border-blue-800 p-4">
                  <div className="font-bold">{field.name}</div>
                  <div className="text-sm text-blue-100">{dLabel(date)} · {pad(start)}:00–{pad(start + dur)}:00 · {dur} soat</div>
                  <div className="font-black text-xl text-green-400 mt-1">Jami: {som(field.price * dur)}</div>
                </div>
              )}
              <button disabled={start === null} onClick={book} className={`w-full py-4 rounded-lg text-lg ${gb(false)}`}>{start === null ? 'Vaqtni tanlang' : 'Buyurtma berish'}</button>
            </div>
          </section>
        )}
        {tab === 'orders' && (
          <section>
            <div className="rounded-xl p-4 text-white bg-blue-900 mb-4 flex items-center justify-between border-l-8 border-green-500">
              <div><div className="text-sm text-blue-200">Jami buyurtmalar summasi</div><div className="text-3xl font-black">{som(sum)}</div></div>
              <Wallet size={34} className="text-blue-200" />
            </div>
            {mine.length === 0 && <p className="text-blue-200">Hali buyurtma yo'q. "Maydonlar" bo'limidan maydon tanlang.</p>}
            <div className="space-y-2">
              {mine.map((b) => {
                const fl = db.fields.find((x) => x.id === b.fieldId)
                return (
                  <div key={b.id} className={`${card} p-3 flex flex-wrap items-center justify-between gap-2 anim-up`}>
                    <div className="flex items-center gap-3">
                      <Img src={fl?.img} className="w-16 h-16 rounded-lg" />
                      <div>
                        <div className="font-extrabold text-white">{fl?.name}</div>
                        <div className="text-sm text-blue-200 flex items-center gap-1"><Clock size={13} />{dLabel(b.date)} · {rng(b)} · {b.hours} soat</div>
                        <div className="font-black text-green-400">{som(b.total)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge s={b.status} />
                      {b.status === 'kutilmoqda' && <button onClick={() => cancel(b.id)} className={`px-3 py-2 rounded-lg text-sm ${gb(false)}`}>Bekor qilish</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

function OrderRow({ b, actions, db, setStatus }) {
  const fl = db.fields.find((x) => x.id === b.fieldId)
  const cu = db.users.find((u) => u.id === b.customerId)
  return (
    <div className={`${card} p-3 space-y-3 anim-up`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Img src={fl?.img} className="w-16 h-16 rounded-lg" />
          <div>
            <div className="font-extrabold text-white">{fl?.name}</div>
            <div className="text-sm text-blue-200 flex items-center gap-1"><Clock size={13} />{dLabel(b.date)} · {rng(b)} · {b.hours} soat</div>
            <div className="text-sm text-blue-200 flex items-center gap-1"><Phone size={13} />{cu?.name} ({ROLE[cu?.role]}) · +998 {cu?.phone}</div>
          </div>
        </div>
        <div className="text-right space-y-1"><div className="font-black text-green-400">{som(b.total)}</div><Badge s={b.status} /></div>
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2">
          {[['qabul', 'Qabul qilindi'], ['kutilmoqda', 'Kutilmoqda'], ['yakunlandi', 'Yakunlandi'], ['rad', 'Rad etish']].map(([k, t]) => (
            <button key={k} onClick={() => setStatus(b.id, k)} className={`rounded-lg px-3 py-2 text-sm ${gb(b.status === k)}`}>{t}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function Owner({ db, upd, me }) {
  const [tab, setTab] = usePersist(`o${me.id}_tab`, 'orders')
  const [f, setF] = useState({ name: '', address: '', price: '', img: '' })
  const [err, setErr] = useState('')
  const [sel, setSel] = usePersist(`o${me.id}_sel`, todayStr())
  const [fq, setFq] = useState('')
  const [editId, setEditId] = useState(null)
  const [ef, setEf] = useState({ name: '', address: '', price: '' })
  const [eerr, setEerr] = useState('')
  // Tayyor (umumiy) maydonlar va o'zi qo'shganlari: hammasini tahrirlash mumkin
  const manage = db.fields.filter((x) => x.ownerId === me.id || x.ownerId == null)
  const shown = manage.filter((x) => (x.name + ' ' + x.address).toLowerCase().includes(fq.toLowerCase()))
  const ids = manage.map((x) => x.id)
  const orders = db.bookings.filter((b) => ids.includes(b.fieldId)).sort((a, b) => (b.at || 0) - (a.at || 0))
  const paid = orders.filter((b) => b.status === 'qabul' || b.status === 'yakunlandi')
  const pending = orders.filter((b) => b.status === 'kutilmoqda').length
  const setStatus = (id, status) => upd((p) => ({ ...p, bookings: p.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }))
  // Tayyor maydonlar o'zgarishi "edits" da, o'zi qo'shganlar fields ichida saqlanadi
  const patchField = (id, patch) => upd((p) => (id > 1000
    ? { ...p, fields: p.fields.map((x) => (x.id === id ? { ...x, ...patch } : x)) }
    : { ...p, edits: { ...(p.edits || {}), [id]: { ...((p.edits || {})[id] || {}), ...patch } } }))
  const pick = async (e) => { const file = e.target.files?.[0]; if (file) setF({ ...f, img: await toDataUrl(file) }) }
  const changeImg = async (id, e) => { const file = e.target.files?.[0]; if (file) patchField(id, { img: await toDataUrl(file) }) }
  const startEdit = (x) => { setEditId(x.id); setEf({ name: x.name, address: x.address, price: String(x.price) }); setEerr('') }
  const saveEdit = () => {
    if (!ef.name.trim() || !ef.address.trim() || !(Number(ef.price) > 0)) return setEerr("Nom, manzil va narxni to'g'ri kiriting")
    patchField(editId, { name: ef.name.trim(), address: ef.address.trim(), price: Number(ef.price) })
    setEditId(null)
  }
  const add = () => {
    if (!f.name.trim() || !f.address.trim() || !(Number(f.price) > 0)) return setErr("Nom, manzil va narxni to'g'ri kiriting")
    setErr('')
    upd((p) => ({ ...p, fields: [{ id: Date.now(), ownerId: me.id, name: f.name.trim(), address: f.address.trim(), price: Number(f.price), img: f.img }, ...p.fields] }))
    setF({ name: '', address: '', price: '', img: '' })
  }
  const byDay = {}
  paid.forEach((b) => { byDay[b.date] = (byDay[b.date] || 0) + (b.total || 0) })
  const dayList = [...new Set([todayStr(), ...Object.keys(byDay)])].sort().reverse()
  const dayOrders = paid.filter((b) => b.date === sel)
  return (
    <>
      <Hero title="Qabul qiluvchi paneli" sub="Mijozlar buyurtmalarini boshqaring, maydon nomi va narxini o'zgartiring, kunlik tushumni kuzating.">
        <Tabs tab={tab} set={setTab} tabs={[['orders', 'Yangi buyurtmalar', Inbox, pending], ['fields', 'Maydonlar', Building2], ['stats', 'Daromat', Wallet]]} />
      </Hero>
      <main key={tab} className="max-w-5xl mx-auto p-4 anim-page">
        {tab === 'orders' && (
          <section className="space-y-2">
            {orders.length === 0 && <p className="text-blue-200">Hozircha buyurtma yo'q. Mijoz maydonni band qilsa, shu yerda chiqadi.</p>}
            {orders.map((b) => <OrderRow key={b.id} b={b} db={db} setStatus={setStatus} actions />)}
          </section>
        )}
        {tab === 'fields' && (
          <section className="space-y-4">
            <div className={`${card} p-4`}>
              <h2 className="text-xl font-black text-white mb-3">Yangi maydon qo'shish</h2>
              <div className="grid sm:grid-cols-4 gap-2">
                <input className={inp} placeholder="Nomi" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                <input className={inp} placeholder="Manzil" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
                <input className={inp} placeholder="Narx (so'm/soat)" inputMode="numeric" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
                <button onClick={add} className={`rounded-lg py-3 flex items-center justify-center gap-2 ${gb(false)}`}><Plus size={18} />Qo'shish</button>
              </div>
              <label className={`mt-3 inline-flex items-center gap-2 cursor-pointer text-sm rounded-lg px-3 py-2 ${gb(false)}`}>
                <ImagePlus size={18} /> Rasm tanlash<input type="file" accept="image/*" className="hidden" onChange={pick} />
              </label>
              {f.img && <Img src={f.img} className="mt-2 w-40 h-24 rounded-lg" />}
              {err && <p className="text-red-300 text-sm mt-2">{err}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-black text-white">Barcha maydonlar ({shown.length})</h2>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <input className={inp + ' pl-9'} placeholder="Qidirish" value={fq} onChange={(e) => setFq(e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-blue-200">Nom, manzil, narx yoki rasmni o'zgartirsangiz, Buyurtma beruvchi 1 va 2 da ham darhol o'zgaradi.</p>
            {shown.map((x) => (editId === x.id ? (
              <div key={x.id} className={`${card} p-3 border-green-600 space-y-2`}>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input className={inp} placeholder="Nomi" value={ef.name} onChange={(e) => setEf({ ...ef, name: e.target.value })} />
                  <input className={inp} placeholder="Manzil" value={ef.address} onChange={(e) => setEf({ ...ef, address: e.target.value })} />
                  <input className={inp} placeholder="Narx (so'm/soat)" inputMode="numeric" value={ef.price} onChange={(e) => setEf({ ...ef, price: e.target.value })} />
                </div>
                {eerr && <p className="text-red-300 text-sm">{eerr}</p>}
                <div className="flex gap-2">
                  <button onClick={saveEdit} className={`px-4 py-2 rounded-lg ${gb(false)}`}>Saqlash</button>
                  <button onClick={() => setEditId(null)} className={`px-4 py-2 rounded-lg ${gb(false)}`}>Bekor qilish</button>
                </div>
              </div>
            ) : (
              <div key={x.id} className={`${card} flex items-center justify-between gap-2 p-2 anim-up`}>
                <div className="flex items-center gap-3 min-w-0">
                  <Img src={x.img} className="w-16 h-12 rounded-lg shrink-0" />
                  <div className="min-w-0"><b className="block truncate">{x.name}</b><div className="text-xs text-blue-200 truncate">{x.address} · {som(x.price)}</div></div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(x)} className={`p-2 rounded-lg ${gb(false)}`} aria-label="Tahrirlash"><Pencil size={18} /></button>
                  <label className={`cursor-pointer p-2 rounded-lg ${gb(false)}`} aria-label="Rasmni almashtirish"><ImagePlus size={18} /><input type="file" accept="image/*" className="hidden" onChange={(e) => changeImg(x.id, e)} /></label>
                  {x.ownerId === me.id && <button onClick={() => upd((p) => ({ ...p, fields: p.fields.filter((y) => y.id !== x.id), bookings: p.bookings.filter((b) => b.fieldId !== x.id) }))} className={`p-2 rounded-lg ${gb(false)}`} aria-label="O'chirish"><Trash2 size={18} /></button>}
                </div>
              </div>
            )))}
          </section>
        )}
        {tab === 'stats' && (
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-white bg-gradient-to-br from-red-600 to-red-800"><div className="text-sm opacity-90">Bugungi tushum</div><div className="text-xl sm:text-2xl font-black">{som(byDay[todayStr()])}</div></div>
              <div className="rounded-xl p-4 text-white bg-blue-900"><div className="text-sm opacity-90">Jami tushum</div><div className="text-xl sm:text-2xl font-black">{som(paid.reduce((s, b) => s + (b.total || 0), 0))}</div></div>
            </div>
            <p className="text-sm text-blue-200">Tushumga faqat "Qabul qilindi" va "Yakunlandi" buyurtmalar kiradi. Kunni bossangiz, o'sha kunning buyurtmalari ochiladi.</p>
            <div className="space-y-2">
              {dayList.map((d) => (
                <button key={d} onClick={() => setSel(d)} className={`w-full flex justify-between items-center rounded-lg p-3 text-left ${gb(sel === d)}`}>
                  <span>{dLabel(d)}{d === todayStr() ? ' (bugun)' : ''}</span><span>{som(byDay[d])}</span>
                </button>
              ))}
            </div>
            <h3 className="font-black text-white">{dLabel(sel)} buyurtmalari ({dayOrders.length})</h3>
            {dayOrders.length === 0 && <p className="text-blue-200">Bu kunda qabul qilingan buyurtma yo'q.</p>}
            {dayOrders.map((b) => <OrderRow key={b.id} b={b} db={db} setStatus={setStatus} />)}
          </section>
        )}
      </main>
    </>
  )
}
