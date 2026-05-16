# SSR/SSG Migration Plan — ClaudeCard (claudecard.pro)

**Status:** Awaiting operator greenlight before execution.
**Prepared:** 2026-05-15
**Reference implementation:** grannyfrannies.com (same stack, already complete)

---

## Current State

- Framework: Vite 8 + React 19 + React Router 7
- Build: `vite build` — outputs a client-side SPA
- Initial HTML payload: `<div id="root"></div>` only
- All content (H1, hero, nav, worlds grid, footer) is JS-injected at runtime
- Deployment: Vercel (single rewrite rule: all routes → index.html)
- Security headers: **none** (vercel.json only contains rewrite)

## Problem

Crawlers, social previewers (Slack/iMessage/Twitter unfurl), and non-JS clients receive a blank page. The rich OG metadata in `<head>` is set correctly, but body content is invisible to any agent that doesn't execute JavaScript.

## Recommended Migration Path: Vite SSG (Prerender)

**Effort estimate:** 2–4 hours  
**Risk:** Low — identical stack to grannyfrannies reference implementation  
**Downtime:** Zero (output is still static files on Vercel)

### Step 1 — Install `react-helmet-async`

```bash
npm install react-helmet-async
```

### Step 2 — Create `src/entry-server.jsx`

Mirror the grannyfrannies pattern. Map each route to its page component and export a `render(url)` function using `renderToString` + `HelmetProvider`.

Routes to prerender:
- `/` — HomePage
- `/rewards` — RewardsPage
- `/auth/callback` — AuthCallbackPage (can be skipped — auth flows don't need prerender)
- `/privacy` — PrivacyPage
- `/terms` — TermsPage
- `/accessibility` — AccessibilityPage

Skip `/admin` — no SEO value, should be noindex.

### Step 3 — Create `scripts/prerender.mjs`

Direct copy of grannyfrannies `scripts/prerender.mjs`. Reads the client build template, calls `render(url)` for each route, injects the HTML, writes `dist/<route>/index.html`.

### Step 4 — Update `vite.config.js`

Add SSR build condition (same as granny-frannies pattern):

```js
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  ...(isSsrBuild && {
    build: { rollupOptions: { output: { format: 'es' } } },
  }),
}))
```

### Step 5 — Update `package.json` build script

```json
"build": "vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr && node scripts/prerender.mjs"
```

### Step 6 — Add `HelmetProvider` to `main.jsx`

Wrap the app with `<HelmetProvider>` so per-page `<Helmet>` tags work.

### Step 7 — Add per-page `<Helmet>` to each page component

Each page uses `<Helmet>` to set its own `<title>` and meta description. The prerender script picks these up via `helmetContext`.

### Step 8 — Update `vercel.json`

Add security headers (see Part 1.2) and verify rewrites still work for the static file structure.

---

## Interim Fix (Applied Now)

Critical above-the-fold content (H1, value prop, CTA) has been added as static HTML inside `<div id="root">` in `index.html`. React replaces this on load; crawlers and social previewers see real content immediately.

---

## What This Does NOT Change

- No component rewrites required
- No routing changes
- Auth flows (Supabase magic link, password recovery) are unaffected — those pages don't need prerender
- Vercel deployment is unchanged — still static file serving

---

## Greenlight Checklist

Before I execute:
- [ ] Operator confirms this migration is approved
- [ ] Operator confirms canonical brand name (needed for per-page Helmet titles)
- [ ] Confirm all routes listed above are correct / add any missing ones
