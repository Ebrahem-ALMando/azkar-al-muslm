'use client'

import { useState } from 'react'
import { Bell, BookOpen, ChevronLeft, ChevronRight, MapPin, Sun, UserRound } from 'lucide-react'
import { markOnboarded, writePreferences } from '@/lib/preferences'

type ThemeOption = { id: string; label: string; primary: string; accent: string }

type OnboardingFlowProps = {
  themes: ThemeOption[]
  themeId: string
  setThemeId: (id: string) => void
  onComplete: (prefs: { displayName: string; city: string }) => void
}

const STEPS = 4

export function OnboardingFlow({ themes, themeId, setThemeId, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [city, setCity] = useState('')
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  function finish(skipPersonalize = false) {
    const name = skipPersonalize ? '' : displayName.trim()
    const place = skipPersonalize ? '' : city.trim()
    writePreferences({
      displayName: name,
      city: place,
      themeId,
    })
    markOnboarded()
    onComplete({ displayName: name, city: place })
  }

  function go(next: number) {
    setDirection(next > step ? 'forward' : 'back')
    setStep(next)
  }

  function next() {
    if (step >= STEPS - 1) {
      finish(false)
      return
    }
    go(step + 1)
  }

  function back() {
    if (step === 0) return
    go(step - 1)
  }

  return (
    <div className="ob-shell" role="dialog" aria-label="مقدمة أذكار المسلم">
      <div className="ob-pattern" aria-hidden />
      <div className="ob-frame">
        <header className="ob-top">
          <img src="/brand/logos/emblem.png" alt="" className="ob-mini-emblem" width={44} height={56} />
          <div>
            <span className="eyebrow">أذكار المسلم</span>
            <strong>ابدأ بهدوء</strong>
          </div>
          <button type="button" className="ob-skip" onClick={() => finish(true)}>
            تخطي
          </button>
        </header>

        <div
          key={`${step}-${direction}`}
          className={`ob-stage ob-stage--${direction}`}
          data-step={step}
        >
          {step === 0 && <WelcomeStep />}
          {step === 1 && <DiscoverStep />}
          {step === 2 && <GrowStep />}
          {step === 3 && (
            <PersonalizeStep
              displayName={displayName}
              setDisplayName={setDisplayName}
              city={city}
              setCity={setCity}
              themes={themes}
              themeId={themeId}
              setThemeId={setThemeId}
            />
          )}
        </div>

        <footer className="ob-footer">
          <div className="ob-progress" aria-hidden>
            {Array.from({ length: STEPS }).map((_, index) => (
              <i key={index} className={index === step ? 'is-active' : index < step ? 'is-done' : ''} />
            ))}
          </div>
          <div className="ob-actions">
            <button type="button" className="ob-back" onClick={back} disabled={step === 0}>
              <ChevronRight size={16} /> السابق
            </button>
            <button type="button" className="primary-btn ob-next" onClick={next}>
              {step === STEPS - 1 ? 'ابدأ رحلتك' : 'التالي'}
              <ChevronLeft size={15} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="ob-welcome">
      <div className="ob-welcome-art">
        <img src="/brand/logos/emblem.png" alt="" className="ob-welcome-emblem" width={160} height={204} />
        <span className="ob-welcome-ring" aria-hidden />
        <span className="ob-welcome-spark" aria-hidden />
      </div>
      <div className="ob-welcome-copy">
        <span className="eyebrow">مرحباً بك</span>
        <h1>رفيقك اليومي للذكر والطمأنينة</h1>
        <p>
          مساحة هادئة صُممت لترافقك على سطح المكتب — بأناقة إسلامية، وحضور لطيف، وخطى صغيرة نحو السكينة.
        </p>
      </div>
    </div>
  )
}

function DiscoverStep() {
  return (
    <div className="ob-discover">
      <div className="ob-discover-copy">
        <span className="eyebrow">اكتشف</span>
        <h1>ما تحتاجه… في مكان واحد</h1>
        <p>أذكارك، مواقيت الصلاة، وتذكيرات هادئة تبقى قريبة دون أن تقاطع يومك.</p>
      </div>
      <div className="ob-illus-grid">
        <article className="ob-illus-card ob-illus-card--adhkar">
          <BookOpen size={22} />
          <strong>الأذكار اليومية</strong>
          <span>ورد الصباح والمساء بلحظات قصيرة</span>
          <div className="ob-illus-pulse" aria-hidden />
        </article>
        <article className="ob-illus-card ob-illus-card--prayer">
          <Sun size={22} />
          <strong>مواقيت الصلاة</strong>
          <span className="ob-illus-time">١٢:١٨</span>
          <small>الصلاة القادمة · الظهر</small>
        </article>
        <article className="ob-illus-card ob-illus-card--remind">
          <Bell size={22} />
          <strong>تذكيرات سطح المكتب</strong>
          <span>إشعارات هادئة في وقتها</span>
          <i className="ob-illus-dot" aria-hidden />
        </article>
      </div>
    </div>
  )
}

function GrowStep() {
  return (
    <div className="ob-grow">
      <div className="ob-palm" aria-hidden>
        <svg viewBox="0 0 160 200" className="ob-palm-svg">
          <ellipse className="ob-palm-soil" cx="80" cy="178" rx="48" ry="10" />
          <path className="ob-palm-trunk" d="M78 170 C76 130 74 100 80 70 C86 100 88 130 86 170 Z" />
          <g className="ob-palm-fronds">
            <path d="M80 72 C52 58 34 48 28 36 C48 44 66 54 80 66 Z" />
            <path d="M80 72 C108 58 126 48 132 36 C112 44 94 54 80 66 Z" />
            <path d="M80 74 C58 70 40 78 30 90 C50 82 66 76 80 78 Z" />
            <path d="M80 74 C102 70 120 78 130 90 C110 82 94 76 80 78 Z" />
            <path d="M80 70 C70 48 68 28 74 16 C78 34 80 50 82 66 Z" />
          </g>
          <circle className="ob-palm-seed" cx="80" cy="168" r="5" />
        </svg>
        <span className="ob-palm-glow" />
      </div>
      <div className="ob-grow-copy">
        <span className="eyebrow">قريباً</span>
        <h1>غراس الذكر</h1>
        <p>
          تصوّر رمزي لنموّك مع الذكر — غرسة هادئة تذكّرك بالاستمرار. هذه معاينة مفاهيمية فقط؛ الميزة الكاملة ستأتي لاحقاً.
        </p>
        <ul className="ob-grow-list">
          <li>حضور يومي بسيط</li>
          <li>نمو بصري لطيف</li>
          <li>بدون إلهاء أو ضغط</li>
        </ul>
      </div>
    </div>
  )
}

function PersonalizeStep({
  displayName,
  setDisplayName,
  city,
  setCity,
  themes,
  themeId,
  setThemeId,
}: {
  displayName: string
  setDisplayName: (v: string) => void
  city: string
  setCity: (v: string) => void
  themes: ThemeOption[]
  themeId: string
  setThemeId: (id: string) => void
}) {
  return (
    <div className="ob-personalize">
      <div className="ob-personalize-copy">
        <span className="eyebrow">خصّص على طريقتك</span>
        <h1>اجعل التجربة أقرب إليك</h1>
        <p>كل الحقول اختيارية — يمكنك تخطيها الآن وتعديلها لاحقاً من الإعدادات.</p>
      </div>
      <div className="ob-form">
        <label className="ob-field">
          <span>
            <UserRound size={16} /> الاسم المفضل
          </span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="مثال: أحمد"
            autoComplete="nickname"
          />
        </label>
        <label className="ob-field">
          <span>
            <MapPin size={16} /> المدينة
          </span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="لتحسين مواقيت الصلاة لاحقاً"
            autoComplete="address-level2"
          />
        </label>
        <div className="ob-theme-pick">
          <span>المظهر</span>
          <div className="ob-theme-row">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={themeId === item.id ? 'is-selected' : ''}
                onClick={() => setThemeId(item.id)}
                style={{ ['--swatch' as string]: item.primary, ['--swatch-gold' as string]: item.accent }}
              >
                <i />
                <em>{item.label}</em>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
