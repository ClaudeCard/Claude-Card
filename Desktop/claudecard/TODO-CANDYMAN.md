# TODO — Needs Input from Candyman

Items blocked on operator decisions or data. Nothing below has been changed in code.
Add your answers directly to this file and I'll execute the corresponding task.

---

## BLOCKER: Canonical Rewards/Passport Program Name (Part 1.3)

**Before I can do any search-and-replace, I need to know the canonical name.**

Current names found across the four sites:
| Name | Where used |
|---|---|
| **Ridiculous Passport** | claudecard Nav.jsx, RidiculousPassport.jsx, granny-frannies UniversalLogin.jsx |
| **rewards circle** | claudecard meta keywords in index.html |
| **Passport** | Generic references everywhere (likely fine to keep as shorthand) |
| **ClaudeCard** | Hub site name — probably stays as-is |

**Your options:**
- `[ ]` **ClaudeCard Passport** — keeps hub brand front and center
- `[ ]` **Ridiculous Passport** — already in the code, leans into the personality
- `[ ]` **ClaudeCard.pro Passport** — treats .pro as part of the mark (per brand-collision note)
- `[ ]` **Something else:** _______________

Once you decide, I will:
1. Do a ripgrep across all four repos showing every instance before touching anything
2. Get your final sign-off on the list
3. Execute the rename
4. Unify all four site footers with identical rewards-program language + link to claudecard.pro

---

## BLOCKER: Canonical Brand Name for the Hub (Part 3.1)

**Separate from the rewards name** — this is about the hub site's own identity.

Brand collision risk: `claudecard.xyz` (crypto card) and `claudecard.fun` (business card) both
rank for "Claude Card" searches, pushing claudecard.pro off the first page.

**Your options:**
- `[ ]` **ClaudeCard** — stay the course, fight for the SERP
- `[ ]` **ClaudeCard.pro** — treat .pro as part of the mark in all references
- `[ ]` **Ridiculous Passport** — make the program the brand
- `[ ]` **Claude's Passport** — possessive, more personal
- `[ ]` **Something else:** _______________

---

## Social URLs — Granny Frannie's (Part 2.2)

Footer social icons currently point to `#`. Provide real URLs or confirm removal.

- Instagram: _______________  `[ ]` Remove instead
- Facebook: _______________   `[ ]` Remove instead
- TikTok: _______________     `[ ]` Remove instead

---

## Real Review Attribution — Granny Frannie's (Part 2.3)

Current reviewers are "Early Customer," "Cookie Club Member," "Local Supporter."
Provide real first names + cities (with their permission) to replace placeholders.

| Current | Real first name | City |
|---|---|---|
| "Early Customer" | | |
| "Cookie Club Member" | | |
| "Local Supporter" | | |

---

## How Ordering Works — Granny Frannie's (Part 2.4)

Need actual numbers before publishing the ordering section:

- Order cutoff day/time: _______________  (e.g., "Tuesday by 6pm")
- Pickup day/time: _______________        (e.g., "Saturday 10am–2pm")
- Pickup address: _______________
- Local delivery radius: _______________  (miles)
- Local delivery fee: _______________     (e.g., "$5 for orders under $30")
- Michigan shipping cost: _______________  (flat rate or "calculated at checkout")

---

## DivePulse Email Capture — Savvy Scuba (Part 4.5)

Which ESP (email service provider) should the DivePulse "coming soon" capture wire to?

- `[ ]` Mailchimp — list name: _______________
- `[ ]` ConvertKit / Kit — form ID: _______________
- `[ ]` Klaviyo — list ID: _______________
- `[ ]` Other: _______________
- `[ ]` Just collect to Supabase for now

---

## Real OG Images Needed (Part 1.4 / 4.1 / 5.5)

| Site | Current OG image | File exists? | Size | Status |
|---|---|---|---|---|
| claudecard.pro | `claude.jpg` | Yes | 450KB | Verify dimensions are 1200×630 |
| grannyfrannies.com | `og.png` (generated) | Yes | 42KB | Looks okay — verify dimensions |
| savvyscuba.com | Unsplash URL (external stock) | No local file | — | **REPLACE — high priority** |
| sweetstone.com | `/og.png` | **FILE MISSING** | — | **CRITICAL — will 404 in social previews** |

**For savvyscuba.com:** Send a real dive photo (yours or Melisa's).
Specs: 1200×630px, under 1MB, JPG or PNG.

**For sweetstone.com:** Send a brand mark or lifestyle image.
Same specs. Until received, social previews will show a broken image.

**Savvy Scuba stock image inventory** (all from Unsplash — all need replacing):
- Hero background: `photo-1544551763-77ef2d0cfc6c` (also used as OG)
- Trip cards: `photo-1682687220742-aba13b6e50ba`, `photo-1544551763-46a013bb70d5`, `photo-1582967788606-a171c1080cb0`
- Gear fallback: `photo-1544551763-46a013bb70d5`
- Destinations (11 images): all from Unsplash
These will be replaced once you provide real trip/gear photography.

---

## SweetStone Compliance Data (Part 5.2)

**Do not publish compliance footer without these answers:**

- States where products are sold: _______________
- License number(s): _______________
- Product type: `[ ]` THC  `[ ]` Hemp/CBD (Farm Bill)  `[ ]` Merch only
- Lab testing / COA plan: `[ ]` Confident Cannabis  `[ ]` Other: _______________
- Payment processor: `[ ]` Aeropay  `[ ]` Jane  `[ ]` Dutchie  `[ ]` Other: _______________
- Is "legacy brand" consistent with your actual licensing status in any regulated state?
  (In CA, "legacy operator" has a specific regulatory meaning. Confirm before publishing.)

---

## SweetStone Age Gate Approval (Part 5.1)

Age verification server-side implementation is coded but **not deployed** until you review.
Flag when you're ready to review the PR.

- Operating age: `[ ]` 21+  `[ ]` Other per state: _______________

---

## PADI Instructor Data — Savvy Scuba (Part 4.3)

Instructor bios component is scaffolded. Need:

**Instructor 1 (Claude):**
- PADI instructor number: _______________
- Certifications: _______________
- Total logged dives: _______________
- Signature destinations: _______________

**Instructor 2 (Melisa):**
- PADI instructor number: _______________
- Certifications: _______________
- Total logged dives: _______________
- Signature destinations: _______________

---

## Google Search Console (Part 3.3)

Sitemap exists at `https://claudecard.pro/sitemap.xml` — you need to submit it manually.
URL: https://search.google.com/search-console → Add property → Submit sitemap

Same for grannyfrannies.com — sitemap is at `/sitemap.xml`.
