'use client'

import { useEffect, useState } from 'react'

type SplashScreenProps = {
  onComplete: () => void
  replayKey?: number
}

const FULL_MS = 4200
const REDUCED_MS = 360

export function SplashScreen({ onComplete, replayKey = 0 }: SplashScreenProps) {
  const [motion, setMotion] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const allowMotion = !reduced && document.visibilityState === 'visible'
    setMotion(allowMotion)

    const duration = allowMotion ? FULL_MS : REDUCED_MS
    const exitAt = duration - (allowMotion ? 420 : 80)
    const exitTimer = window.setTimeout(() => setExiting(true), Math.max(0, exitAt))
    const doneTimer = window.setTimeout(onComplete, duration)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete, replayKey])

  return (
    <div
      className={`az-splash ${motion ? 'az-splash--motion' : 'az-splash--static'} ${exiting ? 'is-exiting' : ''}`}
      role="dialog"
      aria-label="شاشة افتتاح أذكار المسلم"
      aria-live="polite"
    >
      <div className="az-splash__bg" aria-hidden />
      <div className="az-splash__pattern" aria-hidden />
      <div className="az-splash__radial" aria-hidden />
      <div className="az-splash__orbit az-splash__orbit--outer" aria-hidden />
      <div className="az-splash__orbit az-splash__orbit--inner" aria-hidden />

      <div className="az-splash__stage">
        <div className="az-splash__emblem-frame">
          <span className="az-splash__gold-flash" aria-hidden />
          <img
            src="/brand/logos/emblem.png"
            alt=""
            className="az-splash__emblem"
            width={220}
            height={280}
            draggable={false}
          />
        </div>

        <div className="az-splash__copy">
          <p className="az-splash__eyebrow">بسم الله</p>
          <h1 className="az-splash__title">أذكار المسلم</h1>
          <p className="az-splash__tagline">رفيقك اليومي للذكر والطمأنينة</p>
          <div className="az-splash__rule" aria-hidden />
        </div>
      </div>
    </div>
  )
}
