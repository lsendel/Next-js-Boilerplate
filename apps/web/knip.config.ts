import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    'checkly.config.ts',
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'src/utils/Helpers.ts',
    'tests/**/*.ts',
    // Auth system - exports are part of modular design (factory pattern)
    'src/libs/auth/**/*.ts',
    'src/libs/auth/**/*.tsx',
    // Services - singleton exports for future use
    'src/server/api/services/**/*.ts',
    // Tenant context - internal utility
    'src/shared/utils/tenant-context.ts',
    // Marketing components - exported types for extensibility
    'src/client/components/marketing/**/*.tsx',
    // Navigation components - exported types for extensibility
    'src/client/components/navigation/**/*.tsx',
    // Middleware utilities - exported types for internal use
    'src/middleware/utils/**/*.ts',
    // Structured data - exported types for SEO schema
    'src/shared/utils/structuredData.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    '@commitlint/types',
    '@clerk/types',
    'conventional-changelog-conventionalcommits',
    'vite',
    'checkly', // Used in CI workflows and checkly.config.ts
    'dotenv-cli', // Used in CI workflows
    'lefthook', // Git hooks manager (used via CLI)
    'semantic-release', // Used in release workflow
  ],
  // Binaries to ignore during analysis
  ignoreBinaries: [
    'psql', // PostgreSQL CLI tool used in db:history script
    'pg_dump', // PostgreSQL CLI tool used in db:snapshot script
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
