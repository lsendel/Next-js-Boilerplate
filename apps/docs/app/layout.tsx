import type { ReactNode } from 'react'

export const metadata = {
  title: 'Next.js Boilerplate Documentation',
  description: 'Production-ready Next.js 16 boilerplate with TypeScript, Tailwind CSS, authentication, i18n, testing, and monitoring',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
