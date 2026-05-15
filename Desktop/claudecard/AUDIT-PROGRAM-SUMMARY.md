# Audit Program Summary — Claude's Creations Ecosystem

**Audit completed:** 2026-05-15
**Sites audited:** claudecard.pro · grannyfrannies.com · savvyscuba.com · sweetstone.com

---

## What Shipped

### Universal (all four sites)

| Item | Status |
|---|---|
| SSR interim hero fix (H1 + value prop + CTA in initial HTML) | ✅ All three JS-only sites |
| `MIGRATION-PLAN.md` per JS-only site | ✅ claudecard, savvyscuba, sweetstone |
| Security headers baseline (HSTS, X-Content-Type, X-Frame DENY, Referrer-Policy, Permissions-Policy, CSP report-only) | ✅ All four sites |
| `target="_blank"` → `rel="noopener noreferrer"` | ✅ All instances fixed |
| TODO-CANDYMAN.md (all operator-blocked items) | ✅ claudecard repo |
| Stock image audit | ✅ Flagged; sweetstone og.png missing, savvyscuba has 15+ Unsplash URLs |

### Granny Frannie's (grannyfrannies.com) — reference site
- Duplicate nav root cause found and fixed (GLOBAL_CSS/SSR FOUC)
- Social link placeholders removed cleanly
- Review data structure upgraded (firstName + city + verified)
- "How Ordering Works" section built between Menu and Gallery
- Shipping cost transparency added to menu
- Order lead-time urgency banner wired to `ORDER_SCHEDULE` config
- Empty cart states warmed up with "Browse the Menu" CTAs
- **Recipes per product in admin:** `recipeId` on all products, GF recipe added, "📋 Recipe" button in Products tab jumps to pre-expanded recipe
- Security headers, theme-color, preconnect hints, ecosystem footer links

### ClaudeCard (claudecard.pro) — hub site
- Meta description rewritten (194-char laundry list → 141-char benefit copy)
- Sitemap XML bug fixed (`</urlset>` in wrong position — accessibility URL was orphaned)
- Security headers added (previously had none)
- SSR hero content in initial HTML

### Savvy Scuba (savvyscuba.com)
- 4 PADI `Course` + 3 `TouristTrip` + 2 `Product` JSON-LD schemas in initial HTML
- Instructor bios refactored to data-driven `INSTRUCTORS` array with scaffolded PADI/dive fields
- Gear safety: expandable policy section, enhanced listing form, `serviced_date`/`service_shop`/`accessories`/`condition_notes`/`return_policy` fields in cards
- DivePulse teaser: dark ocean section with email capture (Supabase-wired)
- Security headers added to netlify.toml + vercel.json hardened

### SweetStone (sweetstone.com)
- **Age gate wired** — critical gap: modal existed but was never rendered
- sessionStorage → 24-hour persistent cookie
- Compliance footer scaffolding (`ComplianceFooter.jsx`, `COMPLIANCE` config in brand.js)
- Est. 2011 moved from 10px eyebrow → prominent gold display in `<h1>`
- Focus-visible ring added (keyboard users had no visible focus indicator)
- Blocking duplicate font link removed (was loading fonts twice, blocking paint)
- Missing OG + Twitter meta tags added
- Ecosystem footer cross-links added

---

## Outstanding TODOs — Consolidated

### Needs your decision
| Item | Impact |
|---|---|
| Canonical rewards program name (ClaudeCard / Ridiculous Passport / other) | Blocks cross-site footer unification and naming search-replace |
| Hub brand name to address brand collision with claudecard.xyz, claudecard.fun | Affects SEO and discoverability |
| SSG migration greenlight per site | Significant SEO/performance lift; all three plans ready |

### Needs your content
| Item | Site | Impact |
|---|---|---|
| Real dive photo (1200×630) | savvyscuba.com | OG image is Unsplash stock |
| Brand mark image (1200×630) | sweetstone.com | og.png is MISSING — social previews broken |
| PADI instructor numbers + logged dives | savvyscuba.com | Instructor bios show placeholders |
| Social URLs (Instagram/Facebook/TikTok) or confirm permanent removal | grannyfrannies.com | Icons removed, email only |
| Real reviewer names + cities (with permission) | grannyfrannies.com | Placeholder attribution |
| ORDER_SCHEDULE numbers (cutoff day/time, pickup, delivery, shipping fees) | grannyfrannies.com | Shows $5/$12 placeholders |

### Needs your sign-off before deploy
| Item | Site | Risk level |
|---|---|---|
| Age gate changes (5.1) | sweetstone.com | High — cannabis compliance |
| Age gate server-side enforcement (phase 2) | sweetstone.com | High |
| Compliance footer data (5.2) | sweetstone.com | High |
| Legacy brand language (5.3) | sweetstone.com | Medium — CA regulatory |
| Vault content spec (5.6) | sweetstone.com | Medium |
| Gear policy language | savvyscuba.com | Medium — safety liability |

### Your action items after next deploy
| Item | Site |
|---|---|
| Submit sitemap to Google Search Console | claudecard.pro, grannyfrannies.com |
| Monitor CSP report-only → enforce | All four sites |
| DivePulse email list setup | savvyscuba.com — create `divepulse_waitlist` table in Supabase |

---

## Recommended Next Phase — Prioritized by Impact

### Phase 1 — High impact, low risk (do this week)
1. **Deploy all four `audit-fixes/*` branches** — everything except SweetStone 5.1 is safe to ship immediately
2. **SweetStone age gate review** — review `audit-fixes/sweetstone` and sign off on 5.1 before merging
3. **Send real photos** — sweetstone og.png and savvyscuba dive photo are actively broken

### Phase 2 — High impact, requires operator decision
4. **Name the program** — answer the canonical naming question → triggers naming unification across all four footers
5. **Execute SSG migrations** — greenlight claudecard + sweetstone (low risk, same stack as granny-frannies). Savvyscuba is Option A (static homepage).

### Phase 3 — Meaningful but not urgent
6. **Savvy Scuba PADI data** — fill instructor numbers and dives into `INSTRUCTORS` config
7. **Granny Frannie's ORDER_SCHEDULE** — confirm cutoff day/time, pickup address, delivery/shipping fees
8. **Granny Frannie's real reviews** — drop in first names + cities when you have permission
9. **SweetStone COMPLIANCE data** — fill brand.js once states/licenses/COA are confirmed
10. **Vault spec** — provide the member-only drop architecture spec for SweetStone

### Phase 4 — Performance deep dive (after SSG)
11. **Run real Lighthouse audits** — post-SSG, these scores will look materially different
12. **Image optimization pass** — WebP conversion for all product/OG images
13. **CSP enforcement** — move from report-only to enforcement once violations are confirmed clean
14. **Savvy Scuba Netlify vs. Vercel** — confirm production host, clean up the other config

---

## Branch Status Summary

| Branch | Commits ahead | Safe to merge? |
|---|---|---|
| `audit-fixes/claudecard` | 6 | ✅ Yes |
| `audit-fixes/grannyfrannies` | 6 | ✅ Yes |
| `audit-fixes/savvyscuba` | 6 | ✅ Yes |
| `audit-fixes/sweetstone` | 7 | ⚠️ Review 5.1 first |
