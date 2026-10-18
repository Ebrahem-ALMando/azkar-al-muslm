'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, BookOpen, ChevronLeft, Compass, Heart, Home, Library, Menu, Moon, Palette, Play, Search, Settings, Sparkles, Sun, Timer, UserRound, Volume2, X } from 'lucide-react'

type Name = { id: number; name: string; text: string }

type Theme = { id: string; label: string; primary: string; ink: string; paper: string; soft: string; accent: string; dark?: boolean }

const themes: Theme[] = [
  { id: 'emerald', label: 'زمردي هادئ', primary: '#0e5a4c', ink: '#173c36', paper: '#f7f4ec', soft: '#e4eee8', accent: '#b99a5f' },
  { id: 'midnight', label: 'ليل الذكر', primary: '#8bb3a3', ink: '#e9f2ec', paper: '#102e2b', soft: '#1b4440', accent: '#d5b873', dark: true },
  { id: 'sand', label: 'رمل دافئ', primary: '#6d7450', ink: '#424536', paper: '#f5eddf', soft: '#e8ddc8', accent: '#ae8052' },
  { id: 'slate', label: 'نعناع صخري', primary: '#387d77', ink: '#213d42', paper: '#edf3f2', soft: '#dce9e7', accent: '#6e9d91' },
  { id: 'plum', label: 'برقوق ملكي', primary: '#694b69', ink: '#453747', paper: '#f7f0f1', soft: '#eee1e8', accent: '#a88765' },
  { id: 'sky', label: 'سماء وفيروز', primary: '#287e88', ink: '#234650', paper: '#f1f7f6', soft: '#dceff0', accent: '#c49358' },
]

const navItems = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'adhkar', label: 'الأذكار اليومية', icon: BookOpen },
  { id: 'names', label: 'أسماء الله الحسنى', icon: Library },
  { id: 'sakinah', label: 'لحظة سكينة', icon: Sparkles },
  { id: 'tasbeeh', label: 'السبحة الإلكترونية', icon: Timer },
  { id: 'nafahat', label: 'نفحات إيمانية', icon: Heart },
]

const prayers = [
  { name: 'الفجر', time: '04:38', passed: true },
  { name: 'الظهر', time: '12:18' },
  { name: 'العصر', time: '15:42' },
  { name: 'المغرب', time: '18:51' },
  { name: 'العشاء', time: '20:21' },
]

export default function Page() {
  const [active, setActive] = useState('home')
  const [themeId, setThemeId] = useState('emerald')
  const [dark, setDark] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [names, setNames] = useState<Name[]>([])
  const [search, setSearch] = useState('')
  const [selectedName, setSelectedName] = useState<Name | null>(null)
  const [tasbeeh, setTasbeeh] = useState(33)
  const [notifications, setNotifications] = useState(true)

  const theme = themes.find((item) => item.id === themeId) ?? themes[0]
  const filteredNames = useMemo(() => names.filter((item) => item.name.includes(search) || item.text.includes(search)), [names, search])

  useEffect(() => {
    fetch('/data/names-of-allah.json').then((response) => response.json()).then(setNames).catch(() => undefined)
    const hasVisited = window.localStorage.getItem('azkar-visited')
    if (!hasVisited) setShowOnboarding(true)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--az-primary', theme.primary)
    document.documentElement.style.setProperty('--az-ink', dark && !theme.dark ? '#edf5ef' : theme.ink)
    document.documentElement.style.setProperty('--az-paper', dark && !theme.dark ? '#152f2c' : theme.paper)
    document.documentElement.style.setProperty('--az-soft', dark && !theme.dark ? '#214541' : theme.soft)
    document.documentElement.style.setProperty('--az-accent', theme.accent)
  }, [theme, dark])

  function begin() { window.localStorage.setItem('azkar-visited', 'true'); setShowOnboarding(false) }
  function selectNav(id: string) { setActive(id); setShowSettings(false) }

  return (
    <main dir="rtl" className="az-app">
      <aside className="az-sidebar">
        <div className="brand-mark"><span>ن</span></div>
        <div className="brand"><strong>أذكار المسلم</strong><span>رفيقك اليومي</span></div>
        <div className="sidebar-rule" />
        <nav aria-label="التنقل الرئيسي" className="nav-list">
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => selectNav(id)}><Icon size={18} strokeWidth={1.7} /><span>{label}</span>{active === id && <i />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setShowSettings(true)}><Settings size={18} strokeWidth={1.7} /><span>الإعدادات والمظهر</span></button>
          <div className="profile"><div className="avatar">م</div><div><strong>مرحباً بك</strong><span>نسختك الهادئة من اليوم</span></div><ChevronLeft size={16} /></div>
        </div>
      </aside>

      <section className="az-content">
        <header className="topbar"><div className="breadcrumb"><span>الأحد، ١٢ رجب ١٤٤٦</span><b>صباح النور والسكينة</b></div><div className="top-actions"><button aria-label="بحث" className="icon-btn"><Search size={19} /></button><button aria-label="التنبيهات" className="icon-btn notification"><Bell size={19} />{notifications && <i />}</button><button className="mobile-menu" aria-label="القائمة"><Menu size={20} /></button></div></header>

        {active === 'home' && <HomeView setActive={selectNav} tasbeeh={tasbeeh} setTasbeeh={setTasbeeh} />}
        {active === 'names' && <NamesView names={filteredNames} search={search} setSearch={setSearch} onSelect={setSelectedName} />}
        {active === 'adhkar' && <AdhkarView setActive={selectNav} />}
        {active === 'sakinah' && <SakinahView />}
        {active === 'tasbeeh' && <TasbeehView count={tasbeeh} setCount={setTasbeeh} />}
        {active === 'nafahat' && <NafahatView />}
      </section>

      {showSettings && <SettingsPanel themeId={themeId} setThemeId={setThemeId} dark={dark} setDark={setDark} notifications={notifications} setNotifications={setNotifications} close={() => setShowSettings(false)} />}
      {selectedName && <NameDialog name={selectedName} close={() => setSelectedName(null)} />}
      {showOnboarding && <Onboarding begin={begin} />}
    </main>
  )
}

function HomeView({ setActive, tasbeeh, setTasbeeh }: { setActive: (id: string) => void; tasbeeh: number; setTasbeeh: (n: number) => void }) {
  return <div className="page-wrap"><div className="home-intro"><div><span className="eyebrow">الأحد، ١٢ رجب ١٤٤٦</span><h1>صباحك طمأنينة، <em>يا صديق الذكر.</em></h1><p>ابدأ يومك بقلب حاضر، وخطوة صغيرة نحو السكينة.</p></div><button className="circle-play" onClick={() => setActive('sakinah')}><Play size={17} fill="currentColor" /></button></div><div className="home-grid"><div className="prayer-card"><div className="card-heading"><span className="mini-icon"><Sun size={17} /></span><div><span>الصلاة القادمة</span><strong>الظهر</strong></div><Compass size={18} className="muted-icon" /></div><div className="prayer-time">١٢:١٨ <small>م</small></div><div className="remaining"><span>متبقي على الصلاة</span><strong>٠٣:٢٦:٤١</strong></div><div className="prayer-track"><i /></div><div className="prayer-list">{prayers.map((prayer) => <div key={prayer.name} className={prayer.name === 'الظهر' ? 'current' : prayer.passed ? 'passed' : ''}><span>{prayer.name}</span><b>{prayer.time}</b></div>)}</div></div><div className="dhikr-card"><div className="card-heading"><span className="mini-icon gold"><Sparkles size={17} /></span><div><span>ورد اليوم</span><strong>ذكر الصباح</strong></div><Volume2 size={18} className="muted-icon" /></div><div className="dhikr-copy">«أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له»</div><div className="dhikr-footer"><span>ذكر مأثور</span><button onClick={() => setActive('adhkar')}>إكمال الورد <ChevronLeft size={14} /></button></div></div></div><div className="lower-grid"><button className="feature-card names-feature" onClick={() => setActive('names')}><div className="feature-art">٩٩</div><div><span>تأمل اليوم</span><strong>أسماء الله الحسنى</strong><p>اكتشف معنى جديداً يضيء قلبك.</p></div><ChevronLeft /></button><button className="feature-card tasbeeh-feature" onClick={() => setActive('tasbeeh')}><div className="tasbeeh-ring" onClick={(event) => { event.stopPropagation(); setTasbeeh(tasbeeh + 1) }}>{tasbeeh}</div><div><span>لحظة ذكر</span><strong>السبحة الإلكترونية</strong><p>كل تسبيحة، خطوة أقرب.</p></div><ChevronLeft /></button><div className="reflection-card"><span>نفحة إيمانية</span><p>«فَإِنَّ مَعَ الْعُسْرِ يُسْرًا»</p><small>— سورة الشرح</small><button onClick={() => setActive('nafahat')}>اقرأ المزيد <ChevronLeft size={14} /></button></div></div></div>
}

function NamesView({ names, search, setSearch, onSelect }: { names: Name[]; search: string; setSearch: (s: string) => void; onSelect: (n: Name) => void }) { return <div className="page-wrap names-page"><div className="section-head"><div><span className="eyebrow">تأملات يومية</span><h1>أسماء الله الحسنى</h1><p>مئة اسم، ومئة باب للتأمل في عظمة الخالق ورحمته.</p></div><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن اسم أو معنى..." /></div></div><div className="names-meta"><span>{names.length} من الأسماء المعروضة</span><span>المحتوى المرفق — يحتاج إلى مراجعة قبل النشر</span></div><div className="names-grid">{names.map((name) => <button className="name-tile" key={name.id} onClick={() => onSelect(name)}><span>{String(name.id).padStart(2, '٠')}</span><strong>{name.name}</strong><p>{name.text}</p><ChevronLeft size={16} /></button>)}</div></div> }

function AdhkarView({ setActive }: { setActive: (id: string) => void }) { return <div className="page-wrap simple-page"><span className="eyebrow">وردك اليومي</span><h1>الأذكار اليومية</h1><p className="lead">مساحات صغيرة من الذكر، ترافقك في كل وقت.</p><div className="adhkar-hero"><div className="ornament">ذ</div><div><span>ورد الصباح</span><h2>ابدأ يومك بذكر الله</h2><p>أذكار مختارة لتمنح صباحك حضوراً وطمأنينة.</p><button className="primary-btn" onClick={() => setActive('sakinah')}>ابدأ الورد <ChevronLeft size={15} /></button></div></div><div className="choice-row"><div><Sun size={20} /><strong>أذكار الصباح</strong><span>بعد الفجر حتى الشروق</span></div><div><Moon size={20} /><strong>أذكار المساء</strong><span>بعد العصر حتى المغرب</span></div><div><Heart size={20} /><strong>أذكار مطلقة</strong><span>في كل وقت وحين</span></div></div></div> }

function SakinahView() { return <div className="sakinah-page"><div className="sakinah-orbit"><div className="sakinah-logo">ن</div></div><span className="eyebrow">لحظة سكينة</span><h1>خذ نفساً… واذكر الله.</h1><p>اترك ما حولك لدقائق قليلة، واجعل قلبك في حضرة هادئة.</p><button className="primary-btn"><Play size={15} fill="currentColor" /> ابدأ اللحظة</button></div> }
function TasbeehView({ count, setCount }: { count: number; setCount: (n: number) => void }) { return <div className="tasbeeh-page"><span className="eyebrow">لحظة ذكر</span><h1>السبحة الإلكترونية</h1><p className="lead">كل تسبيحة، خطوة أقرب.</p><button className="big-counter" onClick={() => setCount(count + 1)}><span>سُبْحَانَ الله</span><strong>{count}</strong><small>اضغط للتسبيح</small></button><button className="reset-btn" onClick={() => setCount(0)}>إعادة العداد</button></div> }
function NafahatView() { return <div className="page-wrap simple-page"><span className="eyebrow">مختارات هادئة</span><h1>نفحات إيمانية</h1><p className="lead">كلمات قصيرة، تترك أثراً طويلاً.</p><div className="quote-large"><Sparkles size={22} /><blockquote>القلب إذا أقبل على الله أقبلت عليه الدنيا وهي راغمة.</blockquote><span>— تأمل شخصي · يحتاج إلى مراجعة المصدر</span></div></div> }

function NameDialog({ name, close }: { name: Name; close: () => void }) { return <div className="overlay" onClick={close}><div className="name-dialog" onClick={(event) => event.stopPropagation()}><button className="close-btn" onClick={close}><X size={18} /></button><span className="dialog-number">{String(name.id).padStart(2, '٠')}</span><h2>{name.name}</h2><div className="dialog-line" /><p>{name.text}</p><small>المحتوى المرفق — يحتاج إلى مراجعة علمية قبل النشر</small></div></div> }

function SettingsPanel({ themeId, setThemeId, dark, setDark, notifications, setNotifications, close }: { themeId: string; setThemeId: (id: string) => void; dark: boolean; setDark: (v: boolean) => void; notifications: boolean; setNotifications: (v: boolean) => void; close: () => void }) { return <div className="overlay settings-overlay" onClick={close}><div className="settings-panel" onClick={(event) => event.stopPropagation()}><div className="panel-head"><div><span className="eyebrow">مساحتك الخاصة</span><h2>الإعدادات والمظهر</h2></div><button className="close-btn" onClick={close}><X size={18} /></button></div><section><h3>المظهر</h3><div className="theme-options">{themes.map((item) => <button key={item.id} onClick={() => setThemeId(item.id)} className={themeId === item.id ? 'selected' : ''}><i style={{ background: item.primary }} /><span>{item.label}</span></button>)}</div><div className="toggle-row"><span><Moon size={17} /> الوضع الليلي</span><button className={`switch ${dark ? 'on' : ''}`} onClick={() => setDark(!dark)}><i /></button></div></section><section><h3>التنبيهات</h3><div className="toggle-row"><span><Bell size={17} /> تذكيرات الذكر</span><button className={`switch ${notifications ? 'on' : ''}`} onClick={() => setNotifications(!notifications)}><i /></button></div><p className="settings-note">يمكنك تخصيص أوقات التذكير لاحقاً من نسخة سطح المكتب.</p></section><section><h3>الخطوط</h3><div className="font-preview"><span>أذكار المسلم</span><small>Qomra Arabic · عنوان رئيسي</small></div></section></div></div> }

function Onboarding({ begin }: { begin: () => void }) { const [step, setStep] = useState(0); const slides = [{ title: 'رفيقك اليومي للذكر والطمأنينة', text: 'مساحة هادئة تساعدك أن تجعل الذكر جزءاً جميلاً من يومك.', icon: 'ن' }, { title: 'ما تحتاجه، في مكان واحد', text: 'أذكارك، مواقيت الصلاة، أسماء الله الحسنى، ولحظات صغيرة من السكينة.', icon: '✦' }, { title: 'اجعلها على طريقتك', text: 'خصص المظهر والخطوط والتنبيهات كما تحب — كل شيء اختياري.', icon: '⌁' }, { title: 'ابدأ رحلتك', text: 'نسأل الله أن يجعل هذا التطبيق نافعاً، وأن يملأ أيامك طمأنينة.', icon: 'ن' }]; const slide = slides[step]; return <div className="onboarding"><div className="onboard-pattern" /><div className="onboard-content"><div className="onboard-symbol">{slide.icon}</div><span className="eyebrow">أذكار المسلم</span><h1>{slide.title}</h1><p>{slide.text}</p><div className="dots">{slides.map((_, index) => <i key={index} className={index === step ? 'active' : ''} />)}</div><button className="primary-btn" onClick={() => step === slides.length - 1 ? begin() : setStep(step + 1)}>{step === slides.length - 1 ? 'ابدأ رحلتك' : 'التالي'} <ChevronLeft size={15} /></button>{step > 0 && <button className="skip-btn" onClick={begin}>تخطي المقدمة</button>}</div></div> }
