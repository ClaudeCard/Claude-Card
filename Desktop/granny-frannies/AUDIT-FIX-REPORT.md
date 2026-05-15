# Audit Fix Report — Granny Frannie's (grannyfrannies.com)

**Branch:** `audit-fixes/grannyfrannies`
**Audit date:** 2026-05-15
**Status:** Reference implementation — strongest of the four sites going in.

---

## Commits on this branch

| Hash | Description |
|---|---|
| `864fc28` | Security headers added to vercel.json (HSTS, X-Content-Type, X-Frame DENY, Referrer-Policy, Permissions-Policy, CSP report-only with Stripe/GA origins) |
| `b3e44ab` | **Part 2 — all homepage work:** 2.1 duplicate nav fix, 2.2 social links cleaned up, 2.3 review data structure, 2.4 How Ordering Works section, 2.5 shipping transparency, 2.6 urgency banner + ORDER_SCHEDULE config, 2.7 empty cart polish |
| `e5816c8` | Footer cross-ecosystem link comment (placeholder for Part 1.3) |
| `128ae1d` | **Recipes per product in admin:** recipeId on all products, GF recipe added, RecipesTab accepts defaultOpen, Products tab "📋 Recipe" button jumps to pre-expanded recipe |
| `58c2022` | Part 6: theme-color, preconnect hints (fonts + Stripe), ecosystem footer links |

---

## What changed

### Security (1.2)
- `vercel.json`: all six required security headers added. CSP in report-only mode — enforce after monitoring.

### Nav (2.1)
- **Root cause identified:** `GLOBAL_CSS` injected via `useEffect` — absent from SSR HTML. CSS for `.mob-menu{display:none}` never applied before JS ran.
- **Fix 1:** Critical nav CSS added to `index.html <head>` (synchronous) so breakpoint hiding works before JS.
- **Fix 2:** Mobile dropdown changed from always-rendered-hidden to conditional render (`{menuOpen && <div>}`) — no longer appears in SSR output when closed.

### Social links (2.2)
- Instagram, Facebook, TikTok icons removed (all pointed to `#`).
- Email icon and address kept. Awaiting real social URLs.

### Reviews (2.3)
- `SEED_TESTIMONIALS` now supports `{ firstName, city, verified }`.
- Render shows `firstName + city` when provided; falls back to `author`. "✓ verified" chip.

### How Ordering Works (2.4)
- New section between Menu and Gallery: Lead Time, Pickup, Local Delivery, Michigan Shipping.
- All numbers use `ORDER_SCHEDULE` config — one constant to update when you confirm details.

### Shipping transparency (2.5)
- Line under Michigan-only notice: "Pickup free · Local delivery from $X · Michigan shipping from $X".
- Links to How Ordering Works section. Numbers from `ORDER_SCHEDULE`.

### Urgency banner (2.6)
- `ORDER_SCHEDULE` config + `getNextCutoff()` helper added.
- Hero chip: "Order by **[day]** for [fulfillLabel]" — updates automatically week over week.

### Empty cart (2.7)
- Both empty cart states (slide-out and order section) now warm: emoji, two-line copy, "Browse the Menu" button.

### Recipes in admin (Part 2 add-on)
- All products now have `recipeId` field linking to the `RECIPES` array.
- GF cookie (GFC-006) gets its own recipe (id 9) with GF-specific instructions.
- "📋 Recipe" button per product in Products tab — jumps to Recipes tab with recipe pre-expanded.

### Performance (6.2)
- `preconnect` for fonts.googleapis.com, fonts.gstatic.com, and js.stripe.com.
- `dns-prefetch` for googletagmanager.com.

### SEO (6.3)
- `theme-color: #0D1F5C` added.
- Ecosystem cross-links added to footer (ClaudeCard, Savvy Scuba, SweetStone).

---

## Blocked on operator — see TODO-CANDYMAN.md

- **Canonical rewards name** — cross-site footer language (Part 1.3)
- **Real social URLs** — Instagram, Facebook, TikTok (or confirm permanent removal)
- **Real reviewer names + cities** — with permission
- **ORDER_SCHEDULE numbers** — cutoff day/time, pickup address/hours, delivery radius, shipping fees
- **Google Search Console** — submit `https://grannyfrannies.com/sitemap.xml` after next deploy

---

## Lighthouse scores

> Lighthouse not run — requires browser environment (not available in CLI build context).
> Estimated profile based on code analysis:

| Metric | Before | After | Notes |
|---|---|---|---|
| Performance | ~60–70 | ~70–80 | SSG prerender was already in place; preconnects reduce font LCP |
| Accessibility | ~75 | ~88 | Nav aria attributes, skip link, conditional mobile menu |
| Best Practices | ~80 | ~90 | Security headers, noopener noreferrer |
| SEO | ~82 | ~95 | theme-color added, structured data already strong |

---

## New tech debt

- `GLOBAL_CSS` is still injected via `useEffect` — the critical nav CSS in index.html is a shim, not a permanent fix. The right fix is migrating GLOBAL_CSS to a proper `.css` file imported at the top of `main.jsx`. No functional impact, but worth cleaning up.
- `ORDER_SCHEDULE` uses placeholder numbers — all references to `$5` and `$12` in the menu are wrong until you fill them in.
