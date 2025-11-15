import { usePathname } from 'next/navigation'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span className="font-bold text-xl">Next.js Boilerplate</span>,
  project: {
    link: 'https://github.com/ixartz/Next-js-Boilerplate',
  },
  docsRepositoryBase: 'https://github.com/ixartz/Next-js-Boilerplate/tree/main/apps/docs',
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/ixartz" target="_blank" rel="noopener noreferrer">
          Ixartz
        </a>
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Next.js Boilerplate Documentation" />
      <meta
        property="og:description"
        content="Production-ready Next.js 16 boilerplate with TypeScript, Tailwind CSS, authentication, i18n, testing, and monitoring"
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Next.js Boilerplate'
    }
  },
  navigation: {
    prev: true,
    next: true,
  },
  darkMode: true,
  sidebar: {
    toggleButton: true,
    defaultMenuCollapseLevel: 1,
  },
  toc: {
    backToTop: true,
    title: 'On This Page',
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'documentation',
  },
  search: {
    placeholder: 'Search documentation...',
  },
  primaryHue: 210,
  primarySaturation: 100,
}

export default config
