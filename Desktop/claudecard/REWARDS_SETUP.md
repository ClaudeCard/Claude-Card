# Rewards Setup

This site uses one shared Supabase project for the full ClaudeCard ecosystem. Do not create a separate user system for each site. Supabase Auth email identity is the universal identifier.

## 1. Create Supabase Project

Create one Supabase project that will serve every connected site:

- `claudecard.pro`
- `grannyfrannies.com`
- future ecosystem sites

## 2. Run Database Schema

Open the Supabase SQL editor and run:

```sql
supabase/rewards-schema.sql
```

The schema creates:

- `profiles`
- `site_memberships`
- `reward_transactions`
- `rewards_catalog`
- RLS policies
- new-user profile trigger
- site join and reward transaction RPC functions

## 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the Supabase project values.

For `claudecard.pro`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_KEY=claudecard
VITE_SITE_NAME=Claude Card
```

For `grannyfrannies.com`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_KEY=granny_frannies
VITE_SITE_NAME=Granny Frannie’s
```

Each site uses the same Supabase project and only changes `VITE_SITE_KEY` and `VITE_SITE_NAME`.

## 4. Configure Supabase Auth Redirect URLs

In Supabase, go to Authentication -> URL Configuration and add these allowed redirect URLs:

- `http://localhost:5173`
- `https://claudecard.pro`
- `https://www.claudecard.pro`
- `https://grannyfrannies.com`
- `https://www.grannyfrannies.com`

## 5. How It Works

- Supabase Auth owns login and identity.
- Email is the shared identifier across the ecosystem.
- `profiles.global_points` tracks the user's shared ecosystem points.
- `site_memberships.site_points` tracks points for each website.
- `reward_transactions` records point changes.
- RLS prevents users from reading other users' profiles, memberships, or transactions.
- `join_site_membership()` creates a site membership and awards starter points once per site.
- `add_reward_transaction()` exists for trusted server-side reward actions. Do not expose arbitrary point awards directly from frontend code.

## 6. Copying To Another Site

Copy these pieces into another React/Vite site:

- `src/lib/supabaseClient.js`
- `src/components/RewardsAuth.jsx`
- `src/components/RidiculousPassport.jsx`
- `@supabase/supabase-js` dependency

Then set that site's `VITE_SITE_KEY` and `VITE_SITE_NAME`.
