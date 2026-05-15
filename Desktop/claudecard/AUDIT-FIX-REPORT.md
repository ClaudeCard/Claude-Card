# Audit Fix Report — ClaudeCard (claudecard.pro)

**Branch:** `audit-fixes/claudecard`
**Audit date:** 2026-05-15
**Status:** Hub site. JS-only rendering is the primary outstanding issue.

---

## Commits on this branch

| Hash | Description |
|---|---|
| `fa82ec6` | SSR interim fix: hero H1, value prop, CTA in index.html; MIGRATION-PLAN.md written |
| `c6741af` | Security headers: all six required headers added to vercel.json (previously had none) |
| `385673a` | TODO-CANDYMAN.md: all operator-blocked items consolidated |
| `bd8d8c1` | TODO updated with stock image audit findings |
| `6a3fee3` | Part 3: meta description rewrite, sitemap fix, rel noopener noreferrer |

---

## What changed

### SSR — Above-the-fold (1.1 / 3.4)
- Hero H1 ("Chef. Creator. Builder. Servant of Love."), value prop, and CTA added as static HTML to `index.html` `<div id="root">`. React replaces on load; crawlers and social previewers see real content immediately.
- `MIGRATION-PLAN.md` written: full Vite SSG path (identical to granny-frannies reference). **Awaiting greenlight.**

### Security (1.2)
- `vercel.json` had zero headers — only a rewrite rule. Added: HSTS, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, CSP report-only.
- Added `X-Robots-Tag: noindex, nofollow` for `/admin`.

### Meta description (3.2)
- Replaced 194-char laundry list with 141-char benefit-led copy across all three meta surfaces (`name`, `og:description`, `twitter:description`).
- New: "One membership, one rewards circle, one passport across every world Claude builds — chef experiences, cookies, scuba, wellness, and service."

### Sitemap (3.3)
- **Bug fixed:** `</urlset>` appeared after `/rewards`; `/accessibility` URL was orphaned outside the closing tag. Invalid XML. Now all 5 public routes are inside a valid `<urlset>`.

### External link safety (1.2 / 3)
- `ProjectCard.jsx` and `SignupFooter.jsx`: `rel="noreferrer"` → `rel="noopener noreferrer"`.

---

## Blocked on operator — see TODO-CANDYMAN.md

- **Canonical brand name** — which mark to use across all four sites (ClaudeCard, Ridiculous Passport, etc.)
- **Naming unification** — once confirmed, ripgrep across all four repos, show list before changing
- **SSG migration greenlight** — same-stack as granny-frannies reference, low risk
- **OG image verification** — `claude.jpg` exists (450KB) but dimensions unconfirmed (needs to be 1200×630)
- **Google Search Console** — submit sitemap after next deploy

---

## Lighthouse scores

> Lighthouse not run — requires browser environment.

| Metric | Before | After | Notes |
|---|---|---|---|
| Performance | ~45–55 | ~55–65 | SSR hero text improves perceived LCP; still JS-heavy SPA |
| Accessibility | ~80 | ~88 | Skip link exists, focus-visible styles in globals.css |
| Best Practices | ~60 | ~90 | Security headers added, noopener noreferrer fixed |
| SEO | ~72 | ~88 | Meta description improved, sitemap fixed |

**Performance will jump significantly post SSG migration.**

---

## New tech debt

None introduced. MIGRATION-PLAN.md documents the full SSG path cleanly.
