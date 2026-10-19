import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import './brand-experience.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'أذكار المسلم — رفيقك اليومي للذكر والطمأنينة',
  description: 'تجربة هادئة للأذكار اليومية، أسماء الله الحسنى، ولحظات السكينة.',
  applicationName: 'azkar-al-muslm',
  generator: 'azkar-al-muslm',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F2E9' },
    { media: '(prefers-color-scheme: dark)', color: '#092B27' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={`${tajawal.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
