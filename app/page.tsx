'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Home,
  Library,
  Menu,
  Moon,
  Play,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Timer,
  Volume2,
  X,
} from 'lucide-react'
import { OnboardingFlow } from '@/components/brand/OnboardingFlow'
import { SplashScreen } from '@/components/brand/SplashScreen'
import { isOnboarded, readPreferences, writePreferences } from '@/lib/preferences'

type Name = { id: number; name: string; text: string }

type Theme = {
  id: string
  label: string
  primary: string
  primaryFg: string
  ink: string
  paper: string
  soft: string
  accent: string
  accentFg: string
  muted: string
  line: string
  surface: string
  surfaceMuted: string
  surfaceWarm: string
  overlay: string
  sidebarMuted: string
  dark?: boolean
}

type ThemeTokens = {
  bg: string
  bgSubtle: string
  fg: string
  fgMuted: string
  fgSubtle: string
  primary: string
  primaryFg: string
  secondary: string
  secondaryFg: string
  accent: string
  accentFg: string
  muted: string
  border: string
  surface: string
  surfaceElevated: string
  surfaceMuted: string
  surfaceWarm: string
  overlay: string
  sidebarBg: string
  sidebarFg: string
  sidebarMuted: string
}

const themes: Theme[] = [
  {
    id: 'emerald',
    label: 'زمردي هادئ',
    primary: '#0B493B',
    primaryFg: '#FFF9EC',
    ink: '#173c36',
    paper: '#F7F2E9',
    soft: '#E8EFE8',
    accent: '#CDA85F',
    accentFg: '#2f2616',
    muted: '#5f7a72',
    line: '#d5e0d8',
    surface: '#FFF9EC',
    surfaceMuted: '#eef2ec',
    surfaceWarm: '#F4EBD8',
    overlay: 'rgba(9, 43, 39, 0.55)',
    sidebarMuted: '#a8c2b8',
  },
  {
    id: 'midnight',
    label: 'ليل الذكر',
    primary: '#1a4a44',
    primaryFg: '#eef6f1',
    ink: '#e9f2ec',
    paper: '#102e2b',
    soft: '#1b4440',
    accent: '#d5b873',
    accentFg: '#2a2210',
    muted: '#9bb3a3',
    line: '#2a524c',
    surface: '#163936',
    surfaceMuted: '#1b4440',
    surfaceWarm: '#1f3f38',
    overlay: 'rgba(4, 18, 16, 0.62)',
    sidebarMuted: '#8bb3a3',
    dark: true,
  },
  {
    id: 'sand',
    label: 'رمل دافئ',
    primary: '#6d7450',
    primaryFg: '#f8f6ef',
    ink: '#424536',
    paper: '#f5eddf',
    soft: '#e8ddc8',
    accent: '#ae8052',
    accentFg: '#2c2012',
    muted: '#6f6a55',
    line: '#ddd1b8',
    surface: '#fbf7ef',
    surfaceMuted: '#efe6d4',
    surfaceWarm: '#f0e6d2',
    overlay: 'rgba(48, 40, 24, 0.5)',
    sidebarMuted: '#c5c7b0',
  },
  {
    id: 'slate',
    label: 'نعناع صخري',
    primary: '#387d77',
    primaryFg: '#f3faf9',
    ink: '#213d42',
    paper: '#edf3f2',
    soft: '#dce9e7',
    accent: '#6e9d91',
    accentFg: '#142624',
    muted: '#547a7a',
    line: '#c9dbd8',
    surface: '#f7fbfb',
    surfaceMuted: '#e4efed',
    surfaceWarm: '#e8f0ee',
    overlay: 'rgba(20, 42, 44, 0.52)',
    sidebarMuted: '#b7d2cd',
  },
  {
    id: 'plum',
    label: 'برقوق ملكي',
    primary: '#694b69',
    primaryFg: '#faf4f7',
    ink: '#453747',
    paper: '#f7f0f1',
    soft: '#eee1e8',
    accent: '#a88765',
    accentFg: '#2a2116',
    muted: '#7a6574',
    line: '#e0d0d8',
    surface: '#fcf8f9',
    surfaceMuted: '#f0e6ec',
    surfaceWarm: '#f3e8eb',
    overlay: 'rgba(42, 28, 40, 0.52)',
    sidebarMuted: '#cbb6c8',
  },
  {
    id: 'sky',
    label: 'سماء وفيروز',
    primary: '#287e88',
    primaryFg: '#f2fafb',
    ink: '#234650',
    paper: '#f1f7f6',
    soft: '#dceff0',
    accent: '#c49358',
    accentFg: '#2b1f10',
    muted: '#5a7a80',
    line: '#c9e0e2',
    surface: '#f8fcfc',
    surfaceMuted: '#e5f2f3',
    surfaceWarm: '#eaf3f0',
    overlay: 'rgba(18, 42, 48, 0.52)',
    sidebarMuted: '#b4d4d7',
  },
]

function resolveTokens(theme: Theme, dark: boolean): ThemeTokens {
  const forceDark = dark || Boolean(theme.dark)

  if (forceDark && !theme.dark) {
    return {
      bg: '#152f2c',
      bgSubtle: '#1a3834',
      fg: '#edf5ef',
      fgMuted: '#a7c0b6',
      fgSubtle: '#8aaba0',
      primary: theme.primary,
      primaryFg: theme.primaryFg,
      secondary: '#214541',
      secondaryFg: '#edf5ef',
      accent: theme.accent,
      accentFg: theme.accentFg,
      muted: '#a7c0b6',
      border: '#2d524c',
      surface: '#1b3a36',
      surfaceElevated: '#214541',
      surfaceMuted: '#214541',
      surfaceWarm: '#243f38',
      overlay: 'rgba(6, 22, 20, 0.64)',
      sidebarBg: theme.primary,
      sidebarFg: theme.primaryFg,
      sidebarMuted: theme.sidebarMuted,
    }
  }

  return {
    bg: theme.paper,
    bgSubtle: theme.soft,
    fg: theme.ink,
    fgMuted: theme.muted,
    fgSubtle: theme.muted,
    primary: theme.primary,
    primaryFg: theme.primaryFg,
    secondary: theme.soft,
    secondaryFg: theme.ink,
    accent: theme.accent,
    accentFg: theme.accentFg,
    muted: theme.muted,
    border: theme.line,
    surface: theme.surface,
    surfaceElevated: theme.surface,
    surfaceMuted: theme.surfaceMuted,
    surfaceWarm: theme.surfaceWarm,
    overlay: theme.overlay,
    sidebarBg: theme.primary,
    sidebarFg: theme.primaryFg,
    sidebarMuted: theme.sidebarMuted,
  }
}

function applyTokens(tokens: ThemeTokens, mode: 'light' | 'dark') {
  const root = document.documentElement
  root.dataset.mode = mode
  const map: Record<string, string> = {
    '--bg': tokens.bg,
    '--bg-subtle': tokens.bgSubtle,
    '--fg': tokens.fg,
    '--fg-muted': tokens.fgMuted,
    '--fg-subtle': tokens.fgSubtle,
    '--primary': tokens.primary,
    '--primary-fg': tokens.primaryFg,
    '--secondary': tokens.secondary,
    '--secondary-fg': tokens.secondaryFg,
    '--accent': tokens.accent,
    '--accent-fg': tokens.accentFg,
    '--muted': tokens.muted,
    '--border': tokens.border,
    '--surface': tokens.surface,
    '--surface-elevated': tokens.surfaceElevated,
    '--surface-muted': tokens.surfaceMuted,
    '--surface-warm': tokens.surfaceWarm,
    '--overlay': tokens.overlay,
    '--sidebar-bg': tokens.sidebarBg,
    '--sidebar-fg': tokens.sidebarFg,
    '--sidebar-muted': tokens.sidebarMuted,
    '--az-primary': tokens.primary,
    '--az-ink': tokens.fg,
    '--az-paper': tokens.bg,
    '--az-soft': tokens.secondary,
    '--az-accent': tokens.accent,
    '--az-muted': tokens.muted,
    '--az-line': tokens.border,
    '--az-white': tokens.surface,
  }

  Object.entries(map).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

const navItems = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'adhkar', label: 'الأذكار اليومية', icon: BookOpen },
  { id: 'names', label: 'أسماء الله الحسنى', icon: Library },
  { id: 'sakinah', label: 'لحظة سكينة', icon: Sparkles },
  { id: 'tasbeeh', label: 'السبحة الإلكترونية', icon: Timer },
  { id: 'nafahat', label: 'نفحات إيمانية', icon: Heart },
]

/** Existing demo prayer times shipped with the app — not live-calculated. */
const prayers = [
  { name: 'الفجر', time: '04:38', passed: true },
  { name: 'الظهر', time: '12:18' },
  { name: 'العصر', time: '15:42' },
  { name: 'المغرب', time: '18:51' },
  { name: 'العشاء', time: '20:21' },
]

const heroSlides = [
  {
    id: 'morning',
    eyebrow: 'ورد الصباح',
    title: 'صباحك طمأنينة، يا صديق الذكر',
    text: 'ابدأ يومك بقلب حاضر، وخطوة صغيرة نحو السكينة.',
    primaryLabel: 'ابدأ ورد الصباح',
    primaryTarget: 'adhkar',
    secondaryLabel: 'لحظة سكينة',
    secondaryTarget: 'sakinah',
  },
  {
    id: 'prayer',
    eyebrow: 'مواقيت الصلاة',
    title: 'الظهر يقترب… اجعل الانتظار ذكراً',
    text: 'راجع مواقيت يومك بهدوء، وابقَ قريباً من حضورك بين الأذان والإقامة.',
    primaryLabel: 'عرض المواقيت',
    primaryTarget: 'home',
    secondaryLabel: 'سبحة سريعة',
    secondaryTarget: 'tasbeeh',
  },
  {
    id: 'names',
    eyebrow: 'تأمل اليوم',
    title: 'أسماء الله الحسنى',
    text: 'مئة اسم، ومئة باب للتأمل في عظمة الخالق ورحمته.',
    primaryLabel: 'استكشف الأسماء',
    primaryTarget: 'names',
    secondaryLabel: 'نفحة إيمانية',
    secondaryTarget: 'nafahat',
  },
  {
    id: 'sakinah',
    eyebrow: 'لحظة حضور',
    title: 'خذ نفساً… واذكر الله',
    text: 'اترك ما حولك لدقائق قليلة، واجعل قلبك في حضرة هادئة.',
    primaryLabel: 'ابدأ اللحظة',
    primaryTarget: 'sakinah',
    secondaryLabel: 'الأذكار اليومية',
    secondaryTarget: 'adhkar',
  },
] as const

export default function Page() {
  const [active, setActive] = useState('home')
  const [themeId, setThemeId] = useState('emerald')
  const [dark, setDark] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashKey, setSplashKey] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [names, setNames] = useState<Name[]>([])
  const [search, setSearch] = useState('')
  const [selectedName, setSelectedName] = useState<Name | null>(null)
  const [tasbeeh, setTasbeeh] = useState(33)
  const [notifications, setNotifications] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [city, setCity] = useState('')
  const [ready, setReady] = useState(false)

  const theme = themes.find((item) => item.id === themeId) ?? themes[0]
  const filteredNames = useMemo(
    () => names.filter((item) => item.name.includes(search) || item.text.includes(search)),
    [names, search],
  )
  const greeting = displayName.trim() ? `مرحباً، ${displayName.trim()}` : 'مرحباً بك'
  const profileHint = city.trim() ? city.trim() : 'نسختك الهادئة من اليوم'

  useEffect(() => {
    fetch('/data/names-of-allah.json')
      .then((response) => response.json())
      .then(setNames)
      .catch(() => undefined)

    const prefs = readPreferences()
    setDisplayName(prefs.displayName)
    setCity(prefs.city)
    if (prefs.themeId && themes.some((item) => item.id === prefs.themeId)) {
      setThemeId(prefs.themeId)
    }
    const darkPref = window.localStorage.getItem('azkar-dark')
    if (darkPref === 'true') setDark(true)

    setShowOnboarding(!isOnboarded())
    setReady(true)
  }, [])

  useEffect(() => {
    const tokens = resolveTokens(theme, dark)
    const mode = dark || theme.dark ? 'dark' : 'light'
    applyTokens(tokens, mode)
    window.localStorage.setItem('azkar-dark', dark ? 'true' : 'false')
  }, [theme, dark])

  const handleSplashDone = useCallback(() => {
    setShowSplash(false)
  }, [])

  function selectNav(id: string) {
    setActive(id)
    setShowSettings(false)
  }

  function replaySplash() {
    setShowSettings(false)
    setShowSplash(true)
    setSplashKey((value) => value + 1)
  }

  function replayOnboarding() {
    setShowSettings(false)
    setShowOnboarding(true)
  }

  function completeOnboarding(prefs: { displayName: string; city: string }) {
    setDisplayName(prefs.displayName)
    setCity(prefs.city)
    setShowOnboarding(false)
  }

  function persistTheme(id: string) {
    setThemeId(id)
    writePreferences({ themeId: id })
  }

  return (
    <main dir="rtl" className="az-app">
      {showSplash && ready && (
        <SplashScreen key={splashKey} replayKey={splashKey} onComplete={handleSplashDone} />
      )}

      <aside className="az-sidebar">
        <div className="brand-row">
          <img
            src="/brand/logos/emblem.png"
            alt=""
            className="brand-logo"
            width={48}
            height={60}
          />
          <div className="brand">
            <strong>أذكار المسلم</strong>
            <span>رفيقك اليومي</span>
          </div>
        </div>
        <div className="sidebar-rule" />
        <nav aria-label="التنقل الرئيسي" className="nav-list">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => selectNav(id)}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{label}</span>
              {active === id && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setShowSettings(true)}>
            <Settings size={18} strokeWidth={1.7} />
            <span>الإعدادات والمظهر</span>
          </button>
          <div className="profile">
            <div className="avatar">{(displayName.trim() || 'م').slice(0, 1)}</div>
            <div>
              <strong>{greeting}</strong>
              <span>{profileHint}</span>
            </div>
            <ChevronLeft size={16} />
          </div>
        </div>
      </aside>

      <section className="az-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>الأحد، ١٢ رجب ١٤٤٦</span>
            <b>صباح النور والسكينة</b>
          </div>
          <div className="top-actions">
            <button aria-label="بحث" className="icon-btn">
              <Search size={19} />
            </button>
            <button aria-label="التنبيهات" className="icon-btn notification">
              <Bell size={19} />
              {notifications && <i />}
            </button>
            <button className="mobile-menu" aria-label="القائمة">
              <Menu size={20} />
            </button>
          </div>
        </header>

        {active === 'home' && (
          <HomeView setActive={selectNav} tasbeeh={tasbeeh} setTasbeeh={setTasbeeh} />
        )}
        {active === 'names' && (
          <NamesView
            names={filteredNames}
            search={search}
            setSearch={setSearch}
            onSelect={setSelectedName}
          />
        )}
        {active === 'adhkar' && <AdhkarView setActive={selectNav} />}
        {active === 'sakinah' && <SakinahView />}
        {active === 'tasbeeh' && <TasbeehView count={tasbeeh} setCount={setTasbeeh} />}
        {active === 'nafahat' && <NafahatView />}
      </section>

      {showSettings && (
        <SettingsPanel
          themeId={themeId}
          setThemeId={persistTheme}
          dark={dark}
          setDark={setDark}
          notifications={notifications}
          setNotifications={setNotifications}
          close={() => setShowSettings(false)}
          onReplaySplash={replaySplash}
          onReplayOnboarding={replayOnboarding}
        />
      )}
      {selectedName && <NameDialog name={selectedName} close={() => setSelectedName(null)} />}
      {showOnboarding && !showSplash && (
        <OnboardingFlow
          themes={themes.map((item) => ({
            id: item.id,
            label: item.label,
            primary: item.primary,
            accent: item.accent,
          }))}
          themeId={themeId}
          setThemeId={persistTheme}
          onComplete={completeOnboarding}
        />
      )}
    </main>
  )
}

function HeroCarousel({ setActive }: { setActive: (id: string) => void }) {
  const [index, setIndex] = useState(0)
  const slide = heroSlides[index]

  function go(next: number) {
    setIndex((next + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="محتوى سياقي">
      <div className="hero-pattern" aria-hidden />
      <div className="hero-veil" aria-hidden />
      <div className="hero-slides">
        {heroSlides.map((item, slideIndex) => {
          const activeSlide = slideIndex === index
          return (
            <article
              key={item.id}
              className={`hero-slide ${activeSlide ? 'is-active' : ''}`}
              aria-hidden={!activeSlide}
              inert={!activeSlide ? true : undefined}
            >
              <span className="eyebrow">{item.eyebrow}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-btn"
                  tabIndex={activeSlide ? 0 : -1}
                  onClick={() => setActive(item.primaryTarget)}
                >
                  {item.primaryLabel}
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  tabIndex={activeSlide ? 0 : -1}
                  onClick={() => setActive(item.secondaryTarget)}
                >
                  {item.secondaryLabel}
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <div className="hero-nav">
        <div className="hero-dots" role="tablist" aria-label="شرائح المقدمة">
          {heroSlides.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`الشريحة ${slideIndex + 1}: ${item.eyebrow}`}
              aria-current={slideIndex === index ? 'true' : undefined}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button type="button" aria-label="الشريحة التالية" onClick={() => go(index + 1)}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="الشريحة السابقة" onClick={() => go(index - 1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {slide.title}
      </span>
    </section>
  )
}

function HomeView({
  setActive,
  tasbeeh,
  setTasbeeh,
}: {
  setActive: (id: string) => void
  tasbeeh: number
  setTasbeeh: (n: number) => void
}) {
  return (
    <div className="page-wrap">
      <HeroCarousel setActive={setActive} />

      <div className="section-label">
        <h3>يومك بهدوء</h3>
        <span>مواقيت وورد حاضر</span>
      </div>

      <div className="home-grid">
        <div className="prayer-card">
          <div className="card-heading">
            <span className="mini-icon">
              <Sun size={17} />
            </span>
            <div>
              <span>الصلاة القادمة</span>
              <strong>الظهر</strong>
            </div>
            <Compass size={18} className="muted-icon" />
          </div>
          <div className="prayer-time">
            ١٢:١٨ <small>م</small>
          </div>
          <div className="remaining">
            <span>متبقي على الصلاة</span>
            <strong>٠٣:٢٦:٤١</strong>
          </div>
          <div className="prayer-track">
            <i />
          </div>
          <div className="prayer-list">
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className={prayer.name === 'الظهر' ? 'current' : prayer.passed ? 'passed' : ''}
              >
                <span>{prayer.name}</span>
                <b>{prayer.time}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="dhikr-card">
          <div className="card-heading">
            <span className="mini-icon gold">
              <Sparkles size={17} />
            </span>
            <div>
              <span>ورد اليوم</span>
              <strong>ذكر الصباح</strong>
            </div>
            <Volume2 size={18} className="muted-icon" />
          </div>
          <div className="dhikr-copy">
            «أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له»
          </div>
          <div className="dhikr-footer">
            <span>ذكر مأثور</span>
            <button onClick={() => setActive('adhkar')}>
              إكمال الورد <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="section-label">
        <h3>مداخل سريعة</h3>
        <span>للحضور بين يدي الله</span>
      </div>

      <div className="lower-grid">
        <button className="feature-card names-feature" onClick={() => setActive('names')}>
          <div className="feature-art">٩٩</div>
          <div>
            <span>تأمل اليوم</span>
            <strong>أسماء الله الحسنى</strong>
            <p>اكتشف معنى جديداً يضيء قلبك.</p>
          </div>
          <ChevronLeft />
        </button>

        <button className="feature-card tasbeeh-feature" onClick={() => setActive('tasbeeh')}>
          <div
            className="tasbeeh-ring"
            onClick={(event) => {
              event.stopPropagation()
              setTasbeeh(tasbeeh + 1)
            }}
          >
            {tasbeeh}
          </div>
          <div>
            <span>لحظة ذكر</span>
            <strong>السبحة الإلكترونية</strong>
            <p>كل تسبيحة، خطوة أقرب.</p>
          </div>
          <ChevronLeft />
        </button>

        <div className="reflection-card">
          <span>نفحة إيمانية</span>
          <p>«فَإِنَّ مَعَ الْعُسْرِ يُسْرًا»</p>
          <small>— سورة الشرح</small>
          <button onClick={() => setActive('nafahat')}>
            اقرأ المزيد <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function NamesView({
  names,
  search,
  setSearch,
  onSelect,
}: {
  names: Name[]
  search: string
  setSearch: (s: string) => void
  onSelect: (n: Name) => void
}) {
  return (
    <div className="page-wrap names-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">تأملات يومية</span>
          <h1>أسماء الله الحسنى</h1>
          <p>مئة اسم، ومئة باب للتأمل في عظمة الخالق ورحمته.</p>
        </div>
        <div className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن اسم أو معنى..."
          />
        </div>
      </div>
      <div className="names-meta">
        <span>{names.length} من الأسماء المعروضة</span>
        <span>المحتوى المرفق — يحتاج إلى مراجعة قبل النشر</span>
      </div>
      <div className="names-grid">
        {names.map((name) => (
          <button className="name-tile" key={name.id} onClick={() => onSelect(name)}>
            <span>{String(name.id).padStart(2, '٠')}</span>
            <strong>{name.name}</strong>
            <p>{name.text}</p>
            <ChevronLeft size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}

function AdhkarView({ setActive }: { setActive: (id: string) => void }) {
  return (
    <div className="page-wrap simple-page">
      <span className="eyebrow">وردك اليومي</span>
      <h1>الأذكار اليومية</h1>
      <p className="lead">مساحات صغيرة من الذكر، ترافقك في كل وقت.</p>
      <div className="adhkar-hero">
        <div className="ornament">ذ</div>
        <div>
          <span>ورد الصباح</span>
          <h2>ابدأ يومك بذكر الله</h2>
          <p>أذكار مختارة لتمنح صباحك حضوراً وطمأنينة.</p>
          <button className="primary-btn" onClick={() => setActive('sakinah')}>
            ابدأ الورد <ChevronLeft size={15} />
          </button>
        </div>
      </div>
      <div className="choice-row">
        <div>
          <Sun size={20} />
          <strong>أذكار الصباح</strong>
          <span>بعد الفجر حتى الشروق</span>
        </div>
        <div>
          <Moon size={20} />
          <strong>أذكار المساء</strong>
          <span>بعد العصر حتى المغرب</span>
        </div>
        <div>
          <Heart size={20} />
          <strong>أذكار مطلقة</strong>
          <span>في كل وقت وحين</span>
        </div>
      </div>
    </div>
  )
}

function SakinahView() {
  return (
    <div className="sakinah-page">
      <div className="sakinah-orbit">
        <img
          src="/brand/logos/emblem.png"
          alt=""
          className="sakinah-emblem"
          width={96}
          height={122}
        />
      </div>
      <span className="eyebrow">لحظة سكينة</span>
      <h1>خذ نفساً… واذكر الله.</h1>
      <p>اترك ما حولك لدقائق قليلة، واجعل قلبك في حضرة هادئة.</p>
      <button className="primary-btn">
        <Play size={15} fill="currentColor" /> ابدأ اللحظة
      </button>
    </div>
  )
}

function TasbeehView({ count, setCount }: { count: number; setCount: (n: number) => void }) {
  return (
    <div className="tasbeeh-page">
      <span className="eyebrow">لحظة ذكر</span>
      <h1>السبحة الإلكترونية</h1>
      <p className="lead">كل تسبيحة، خطوة أقرب.</p>
      <button className="big-counter" onClick={() => setCount(count + 1)}>
        <span>سُبْحَانَ الله</span>
        <strong>{count}</strong>
        <small>اضغط للتسبيح</small>
      </button>
      <button className="reset-btn" onClick={() => setCount(0)}>
        إعادة العداد
      </button>
    </div>
  )
}

function NafahatView() {
  return (
    <div className="page-wrap simple-page">
      <span className="eyebrow">مختارات هادئة</span>
      <h1>نفحات إيمانية</h1>
      <p className="lead">كلمات قصيرة، تترك أثراً طويلاً.</p>
      <div className="quote-large">
        <Sparkles size={22} />
        <blockquote>القلب إذا أقبل على الله أقبلت عليه الدنيا وهي راغمة.</blockquote>
        <span>— تأمل شخصي · يحتاج إلى مراجعة المصدر</span>
      </div>
    </div>
  )
}

function NameDialog({ name, close }: { name: Name; close: () => void }) {
  return (
    <div className="overlay" onClick={close}>
      <div className="name-dialog" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" onClick={close} aria-label="إغلاق">
          <X size={18} />
        </button>
        <span className="dialog-number">{String(name.id).padStart(2, '٠')}</span>
        <h2>{name.name}</h2>
        <div className="dialog-line" />
        <p>{name.text}</p>
        <small>المحتوى المرفق — يحتاج إلى مراجعة علمية قبل النشر</small>
      </div>
    </div>
  )
}

function SettingsPanel({
  themeId,
  setThemeId,
  dark,
  setDark,
  notifications,
  setNotifications,
  close,
  onReplaySplash,
  onReplayOnboarding,
}: {
  themeId: string
  setThemeId: (id: string) => void
  dark: boolean
  setDark: (v: boolean) => void
  notifications: boolean
  setNotifications: (v: boolean) => void
  close: () => void
  onReplaySplash: () => void
  onReplayOnboarding: () => void
}) {
  const aboutLogo = dark
    ? '/brand/logos/logo-stacked-dark.png'
    : '/brand/logos/logo-stacked-light.png'

  return (
    <div className="overlay settings-overlay" onClick={close}>
      <div
        className="settings-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="الإعدادات"
      >
        <div className="panel-head">
          <div>
            <span className="eyebrow">مساحتك الخاصة</span>
            <h2>الإعدادات والمظهر</h2>
          </div>
          <button className="close-btn" onClick={close} aria-label="إغلاق الإعدادات">
            <X size={18} />
          </button>
        </div>

        <section>
          <h3>المظهر</h3>
          <div className="theme-options">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setThemeId(item.id)}
                className={themeId === item.id ? 'selected' : ''}
              >
                <i style={{ background: item.primary }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="toggle-row">
            <span>
              <Moon size={17} /> الوضع الليلي
            </span>
            <button
              type="button"
              className={`switch ${dark ? 'on' : ''}`}
              onClick={() => setDark(!dark)}
              aria-pressed={dark}
              aria-label="تبديل الوضع الليلي"
            >
              <i />
            </button>
          </div>
        </section>

        <section>
          <h3>التنبيهات</h3>
          <div className="toggle-row">
            <span>
              <Bell size={17} /> تذكيرات الذكر
            </span>
            <button
              type="button"
              className={`switch ${notifications ? 'on' : ''}`}
              onClick={() => setNotifications(!notifications)}
              aria-pressed={notifications}
              aria-label="تبديل تذكيرات الذكر"
            >
              <i />
            </button>
          </div>
          <p className="settings-note">
            يمكنك تخصيص أوقات التذكير لاحقاً من نسخة سطح المكتب.
          </p>
        </section>

        <section>
          <h3>التجربة البصرية</h3>
          <div className="settings-actions">
            <button type="button" className="settings-action-btn" onClick={onReplaySplash}>
              <span>إعادة تشغيل شاشة الافتتاح</span>
              <RotateCcw size={15} />
            </button>
            <button type="button" className="settings-action-btn" onClick={onReplayOnboarding}>
              <span>إعادة تشغيل المقدمة</span>
              <RotateCcw size={15} />
            </button>
          </div>
        </section>

        <section>
          <h3>الخطوط</h3>
          <div className="font-preview">
            <span>أذكار المسلم</span>
            <small>Qomra Arabic · عنوان رئيسي · Tajawal للواجهة</small>
          </div>
        </section>

        <section>
          <h3>حول التطبيق</h3>
          <div className="about-brand">
            <img src={aboutLogo} alt="أذكار المسلم" width={180} height={120} />
            <p>رفيقك اليومي للذكر والطمأنينة · azkar-al-muslm</p>
          </div>
        </section>
      </div>
    </div>
  )
}
