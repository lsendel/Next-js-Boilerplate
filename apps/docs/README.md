# Next.js Boilerplate Documentation

**Production-ready documentation site built with Nextra**

🌐 **Live Site:** http://localhost:3001

## Overview

This is a comprehensive documentation site for the Next.js Boilerplate, built with:

- **Nextra 4.2.0** - Documentation framework
- **Next.js 16** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (inherited from Nextra theme)

## Quick Start

```bash
# Development
pnpm dev:docs

# Build
pnpm build:docs

# Production
pnpm start:docs
```

## Structure

```
apps/docs/
├── app/                    # Documentation content (MDX)
│   ├── index.mdx          # Landing page
│   ├── _meta.json         # Root navigation
│   ├── getting-started/   # Getting Started section ✅
│   ├── architecture/      # Architecture guides ⏳
│   ├── guides/            # Feature guides ⏳
│   ├── integrations/      # Integration guides ⏳
│   ├── api/               # API reference ⏳
│   ├── operations/        # Operations guides ⏳
│   ├── advanced/          # Advanced topics ⏳
│   └── reference/         # Reference docs ⏳
├── public/                # Static assets
├── next.config.mjs        # Next.js configuration
├── theme.config.tsx       # Nextra theme configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Features

- ✅ **Full-text search** with code block indexing
- ✅ **Dark mode** support
- ✅ **Mobile responsive** navigation
- ✅ **Table of contents** auto-generated
- ✅ **Edit on GitHub** integration
- ✅ **Syntax highlighting** with Shiki
- ✅ **MDX support** for interactive components
- ✅ **SEO optimized** with proper metadata

## Writing Documentation

### Create a New Page

1. Create an MDX file in the appropriate section:
   ```bash
   touch app/guides/my-guide.mdx
   ```

2. Add frontmatter (optional):
   ```mdx
   ---
   title: "My Guide"
   description: "Description of my guide"
   ---

   # My Guide

   Content here...
   ```

3. Update `_meta.json` in the same directory:
   ```json
   {
     "my-guide": {
       "title": "My Guide",
       "type": "page"
     }
   }
   ```

4. View at http://localhost:3001/guides/my-guide

### Navigation Configuration

Each directory needs a `_meta.json` file:

```json
{
  "index": {
    "title": "Overview",
    "type": "page"
  },
  "page-name": {
    "title": "Page Title",
    "type": "page"
  },
  "subsection": {
    "title": "Subsection",
    "type": "page"
  }
}
```

### MDX Features

Nextra supports enhanced markdown:

```mdx
# Headings

Regular markdown content...

## Code Blocks

```bash
pnpm install
```

## Callouts

:::info
Info message
:::

:::warning
Warning message
:::

:::tip
Tip message
:::

## Details/Summary

<details>
<summary>Click to expand</summary>
Hidden content here
</details>

## Tables

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Internal Links

Use absolute paths without file extensions:

```mdx
[Link to guide](/guides/authentication)
[Link to section](/guides/authentication#setup)
```

## Theme Customization

Edit `theme.config.tsx` to customize:

- Logo
- Project links (GitHub, Discord)
- Footer content
- SEO metadata
- Navigation behavior
- Search settings

## Deployment
The **main web app** is deployed to Cloudflare Pages + Workers with D1. The docs site can be hosted on any platform (including Vercel) as a standard Next.js app.



### Vercel (Example – docs site only)

```bash
# Build locally
pnpm build:docs

# Deploy to Vercel
vercel --prod
```

### Other Platforms

The docs site is a standard Next.js app and can be deployed anywhere:

- Netlify
- Cloudflare Pages
- AWS Amplify
- Self-hosted

## Development

### Hot Reload

The site automatically reloads when you:
- Edit MDX files
- Update `_meta.json` files
- Change theme configuration

### Build for Production

```bash
pnpm build:docs
```

Outputs to `.next/` directory.

### Preview Production Build

```bash
pnpm build:docs
pnpm start:docs
```

## Migration Progress

Current status: **Phase 1 Complete (8%)**

- ✅ Landing page
- ✅ Getting Started (5 pages)
- ⏳ Architecture (6 pages)
- ⏳ Guides (30+ pages)
- ⏳ Integrations (8 pages)
- ⏳ API Reference (migrate 34KB)
- ⏳ Operations (migrate 72KB CI/CD guide)
- ⏳ Advanced (6 pages)
- ⏳ Reference (6 pages)

**Total:** 6 / 75 pages complete

See `DOCUMENTATION_MIGRATION_PLAN.md` in root for details.

## Helper Resources

- **Migration Plan:** `/DOCUMENTATION_MIGRATION_PLAN.md`
- **How to Continue:** `/CONTINUE_DOCUMENTATION.md`
- **Summary:** `/NEXTRA_IMPLEMENTATION_SUMMARY.md`
- **Migration Scripts:** `/scripts/migration/`

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Restart
pnpm dev:docs
```

### Page Not Showing

1. Check `_meta.json` exists
2. Verify filename matches meta key
3. Ensure no syntax errors in MDX

### Search Not Working

Search is automatically configured. Rebuild if issues persist:

```bash
rm -rf .next
pnpm build:docs
```

### Links Broken

- Use absolute paths: `/guides/page`
- Don't include file extensions
- Check spelling and case sensitivity

## Contributing

### Adding Diagrams

1. Create diagram as SVG or PNG
2. Place in `public/diagrams/`
3. Reference in MDX:
   ```mdx
   ![Diagram](../../public/diagrams/my-diagram.svg)
   ```

### Code Examples

Use proper syntax highlighting:

````mdx
```typescript
import { useState } from 'react'

export function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```
````

### Writing Style

- Use second person ("you" not "we")
- Be concise and direct
- Include code examples
- Link to related pages
- Test all code snippets

## Resources

- **Nextra Docs:** https://nextra.site/docs
- **Next.js Docs:** https://nextjs.org/docs
- **MDX Docs:** https://mdxjs.com/
- **Main Project:** `../web/`

## Scripts

```bash
# Development
pnpm dev              # Start dev server (port 3001)

# Build
pnpm build            # Build for production

# Production
pnpm start            # Run production server

# Quality
pnpm lint             # Lint documentation
pnpm clean            # Remove .next directory
```

## License

MIT - Same as main project

---

**Ready to contribute?** See `/CONTINUE_DOCUMENTATION.md` for next steps!
