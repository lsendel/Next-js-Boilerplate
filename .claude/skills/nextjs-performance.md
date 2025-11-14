---
name: nextjs-performance
description: Analyze and optimize Next.js application performance
tools:
  - Bash
  - Read
  - Grep
---

# Next.js Performance Optimization Skill

Comprehensive performance analysis and optimization recommendations.

## Performance Metrics:

### 1. Bundle Size Analysis
**Run**: `npm run build-stats`
- Opens webpack-bundle-analyzer
- Identifies large dependencies
- Finds duplicate packages
- Checks for proper tree-shaking

**Target Metrics**:
- First Load JS: < 200 KB (Next.js recommendation)
- Total Bundle: < 500 KB
- Individual routes: < 100 KB

**Common Issues**:
```bash
# Find large imports
grep -r "import.*from 'lodash'" src/     # Should use 'lodash-es'
grep -r "import.*from 'moment'" src/      # Should use 'date-fns'
grep -r "import.*from '@/'" src/         # Check for barrel imports
```

### 2. Next.js Build Output Analysis
**Run**: `npm run build`
- Review build output for warnings
- Check route sizes
- Identify static vs dynamic pages

**Analyze**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    137 B          88.8 kB
├ ○ /_not-found                          871 B          89.5 kB
├ ○ /[locale]                            137 B          88.8 kB
...
```

### 3. Image Optimization
**Check**:
- [ ] Using Next.js `<Image>` component (not `<img>`)
- [ ] Proper `sizes` attribute for responsive images
- [ ] Images in WebP/AVIF format
- [ ] Lazy loading enabled
- [ ] Priority loading for above-fold images

**Scan for non-optimized images**:
```bash
grep -r '<img' src/ --include="*.tsx"
```

### 4. Font Optimization
**Check**:
- [ ] Using `next/font` for self-hosted fonts
- [ ] `font-display: swap` or `optional`
- [ ] Only loading needed font weights/styles
- [ ] Preloading critical fonts

### 5. Component Performance

#### React Patterns:
```bash
# Find components without memoization
grep -r 'export.*function' src/components/ | grep -v memo

# Find expensive calculations without useMemo
grep -r '\.map\|\.filter\|\.reduce' src/ --include="*.tsx"

# Find useEffect without dependencies
grep -r 'useEffect.*\[\]' src/
```

#### Server vs Client Components:
- [ ] Use Server Components by default
- [ ] Add `'use client'` only when needed (interactivity, browser APIs)
- [ ] Move server-only logic to Server Components
- [ ] Minimize Client Component bundle

### 6. Data Fetching Performance
**Check**:
- [ ] Parallel data fetching (Promise.all)
- [ ] Proper caching strategies (fetch cache options)
- [ ] Streaming with Suspense boundaries
- [ ] Incremental Static Regeneration (ISR) where appropriate

**Anti-patterns to avoid**:
```typescript
// ❌ Bad: Sequential fetching
const user = await getUser();
const posts = await getPosts(user.id);

// ✅ Good: Parallel fetching
const [user, posts] = await Promise.all([
  getUser(),
  getPosts()
]);
```

### 7. Database Query Performance
**Check**:
- [ ] No N+1 query problems
- [ ] Proper indexes on frequently queried columns
- [ ] Limit/pagination on large result sets
- [ ] Avoid `SELECT *` (select only needed columns)

### 8. Third-Party Scripts
**Check**:
- [ ] Using `next/script` with proper strategy
- [ ] Defer non-critical scripts
- [ ] Remove unused analytics/tracking

### 9. Rendering Strategy
**Optimize**:
- Static Generation (SSG) for marketing pages
- Server-Side Rendering (SSR) for dynamic content
- Client-Side Rendering (CSR) only when needed
- Streaming for long pages

### 10. Code Splitting
**Check**:
- [ ] Dynamic imports for large components
- [ ] Route-based code splitting (automatic in Next.js)
- [ ] Lazy load modals, tooltips, non-critical UI

**Example**:
```typescript
// ✅ Good: Dynamic import for heavy component
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Spinner />,
  ssr: false
});
```

## Profiling Tools:

### Built-in
```bash
npm run build-stats           # Bundle analysis
npm run build                 # Build performance metrics
```

### Browser DevTools
- Lighthouse (Performance score > 90)
- Chrome DevTools Performance tab
- React DevTools Profiler

### Monitoring (Production)
- Sentry Performance Monitoring
- PostHog Session Recording
- Next.js Speed Insights

## Output Format:
```
⚡ Performance Audit Report
===========================

📦 Bundle Size:
- First Load JS: 185 KB ✅ (target: < 200 KB)
- Largest Bundle: 45 KB
- Total Bundles: 12

🖼️  Images:
- Optimized: 23/25 ✅
- Non-optimized: 2 ❌
  - public/hero.png (use next/image)
  - src/components/Avatar.tsx (missing sizes)

⚛️  Components:
- Server Components: 45
- Client Components: 12
- Heavy Client Components (> 50 KB): 2 ⚠️

🔄 Data Fetching:
- Parallel fetching: ✅
- Proper caching: ⚠️ (3 uncached requests)
- Suspense boundaries: ✅

🗄️  Database:
- Queries analyzed: 15
- N+1 issues: 1 ❌
- Missing indexes: 2 ⚠️

📊 Lighthouse Score:
- Performance: 92 ✅
- Accessibility: 98 ✅
- Best Practices: 100 ✅
- SEO: 100 ✅

🎯 Priority Optimizations:
1. Fix N+1 query in user posts (priority: high)
2. Convert 2 images to next/image (priority: high)
3. Add memoization to ExpensiveChart component (priority: medium)
4. Lazy load modal components (priority: low)

💡 Recommendations:
- Enable React Compiler (already configured!)
- Consider ISR for blog posts
- Add missing database indexes
- Implement proper fetch caching
```

## Quick Wins:
1. Convert `<img>` to `<Image>`
2. Add `loading="lazy"` to below-fold images
3. Dynamic import for modals/tooltips
4. Add `priority` to hero images
5. Implement proper fetch cache options
