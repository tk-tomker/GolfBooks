# GolfBooks

GolfBooks is a Next.js application for managing golf-club bookings, live feeds, and chats. This README summarizes how the project is organized, how to run it, important internal APIs, and troubleshooting notes.

## Quick links (key files & exports)

- Project root: [my-app/package.json](my-app/package.json)  
- Main app entry: [`Home`](my-app/src/app/page.tsx) — [my-app/src/app/page.tsx](my-app/src/app/page.tsx)  
- App layout: [`RootLayout`](my-app/src/app/layout.tsx) — [my-app/src/app/layout.tsx](my-app/src/app/layout.tsx)  
- Global styles: [my-app/src/app/globals.css](my-app/src/app/globals.css)  
- Authentication webhook: [`POST`](my-app/src/app/api/clerk-webhook/route.ts) — [my-app/src/app/api/clerk-webhook/route.ts](my-app/src/app/api/clerk-webhook/route.ts)

UI components
- Calendar base: [`Calendar`, `CalendarDayButton`](my-app/src/components/ui/calendar.tsx) — [my-app/src/components/ui/calendar.tsx](my-app/src/components/ui/calendar.tsx)  
- Calendar variant / booking UI: [`Calendar20`](my-app/src/components/ui/calendar-20.tsx) — [my-app/src/components/ui/calendar-20.tsx](my-app/src/components/ui/calendar-20.tsx)  
- Controls: [`Button`, `buttonVariants`](my-app/src/components/ui/button.tsx) — [my-app/src/components/ui/button.tsx](my-app/src/components/ui/button.tsx)  
- Card primitives: [`Card`, `CardFooter`, `CardContent`](my-app/src/components/ui/card.tsx) — [my-app/src/components/ui/card.tsx](my-app/src/components/ui/card.tsx)  
- Page components: [my-app/src/components/NextBooking.tsx](my-app/src/components/NextBooking.tsx), [my-app/src/components/LiveFeed.tsx](my-app/src/components/LiveFeed.tsx), [my-app/src/components/Chat.tsx](my-app/src/components/Chat.tsx)

Supabase helpers
- Browser client: [`createClient`](my-app/src/lib/supabase/supabaseClient.ts) — [my-app/src/lib/supabase/supabaseClient.ts](my-app/src/lib/supabase/supabaseClient.ts)  
- Server client (SSR): [`createClient`](my-app/src/lib/supabase/supabaseServer.ts) — [my-app/src/lib/supabase/supabaseServer.ts](my-app/src/lib/supabase/supabaseServer.ts)

Utilities & scripts
- Classname helper: [`cn`](my-app/src/lib/utils.ts) — [my-app/src/lib/utils.ts](my-app/src/lib/utils.ts)  
- Clerk -> Supabase import script: [my-app/src/scripts/importClerkUsers.js](my-app/src/scripts/importClerkUsers.js)

## Getting started

1. Install dependencies
```bash
npm install
```

2. Local dev
```bash
npm run dev
# uses Next dev server (turbopack by default)
```

3. Build / start
```bash
npm run build
npm run start
```

## Required environment variables

Create or update [my-app/.env.local](my-app/.env.local) with at least:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (used by client `createClient` in [my-app/src/lib/supabase/supabaseClient.ts](my-app/src/lib/supabase/supabaseClient.ts))
- SUPABASE_SERVICE_ROLE_KEY (server-side/in scripts as needed)
- CLERK_SECRET_KEY and CLER_WEBHOOK_SECRET (used by [my-app/src/app/api/clerk-webhook/route.ts](my-app/src/app/api/clerk-webhook/route.ts))

Note: server-side code uses the server `createClient` in [my-app/src/lib/supabase/supabaseServer.ts](my-app/src/lib/supabase/supabaseServer.ts) which reads cookies for SSR session handling.

## Architecture overview

- Next.js App Router under [my-app/src/app](my-app/src/app). `Home` is the main page at [my-app/src/app/page.tsx](my-app/src/app/page.tsx). Layouts and global CSS live under the same folder.
- UI primitives (Button, Card, Calendar) are in [my-app/src/components/ui/](my-app/src/components/ui/). The custom `Calendar` uses `react-day-picker` and the `Button` variants via `class-variance-authority`.
- Authentication is handled with Clerk (`@clerk/nextjs`), and the webhook receiver is implemented at [my-app/src/app/api/clerk-webhook/route.ts](my-app/src/app/api/clerk-webhook/route.ts).
- Persistence is Supabase. Client-side code uses [`createClient`](my-app/src/lib/supabase/supabaseClient.ts) while server code uses the SSR helper at [my-app/src/lib/supabase/supabaseServer.ts](my-app/src/lib/supabase/supabaseServer.ts).
- Utilities: `cn` in [my-app/src/lib/utils.ts](my-app/src/lib/utils.ts) centralizes classname merging.

## How bookings work (high level)

- Booking UI is in [my-app/src/components/ui/calendar-20.tsx](my-app/src/components/ui/calendar-20.tsx) (`Calendar20`). It:
  - Renders a calendar (uses [`Calendar`](my-app/src/components/ui/calendar.tsx))
  - Collects date + time and calls Supabase to insert into `bookings` using the app client from [my-app/src/lib/supabase/supabaseClient.ts](my-app/src/lib/supabase/supabaseClient.ts)

- Listing upcoming bookings: [my-app/src/components/NextBooking.tsx](my-app/src/components/NextBooking.tsx) reads bookings and formats them for display.

## Scripts & utilities

- Local import of Clerk users into Supabase: [my-app/src/scripts/importClerkUsers.js](my-app/src/scripts/importClerkUsers.js) — run via node with environment variables set.
- API webhook: [my-app/src/app/api/clerk-webhook/route.ts](my-app/src/app/api/clerk-webhook/route.ts) verifies webhook signatures via `svix` and writes user records to Supabase.

## Troubleshooting & known issues

- SSL / external style fetch: the repo documentation notes a self-signed SSL certificate prevents fetching external UI styles from `https://ui.shadcn.com` in some environments. This may make some UI styles unavailable until resolved.
- Webhook handler: confirm `CLER_WEBHOOK_SECRET` is set. The handler performs signature verification; malformed requests will respond 400.
- Environment mismatches: ensure NEXT_PUBLIC_* vars are available for the browser client and service role keys are kept server-side.
- If you see styling/class issues, check [my-app/src/app/globals.css](my-app/src/app/globals.css) and the component variants in [my-app/src/components/ui/button.tsx](my-app/src/components/ui/button.tsx) and [my-app/src/components/ui/calendar.tsx](my-app/src/components/ui/calendar.tsx).

## Testing & development tips

- When iterating on the calendar UI, edit [my-app/src/components/ui/calendar.tsx](my-app/src/components/ui/calendar.tsx) and [my-app/src/components/ui/calendar-20.tsx](my-app/src/components/ui/calendar-20.tsx). Both rely on Tailwind utility classes defined via [my-app/src/app/globals.css](my-app/src/app/globals.css).
- Use the Clerk dev tools and logs to validate authentication flows that surface in [my-app/src/app/layout.tsx](my-app/src/app/layout.tsx) and the `UserButton` usage.

## Contributing

- Follow the code style used in UI components (utility-first Tailwind, `cn` helper).
- Keep secrets out of repo; use local `.env.local` or secrets in the target deployment (Vercel, etc).

## Deployment

- The app is compatible with Vercel. Build with:
```bash
npm run build
```
- Ensure environment variables are configured in the hosting provider.

## References

- Package manifest: [my-app/package.json](my-app/package.json)  
- Core client helper: [`createClient` (browser)](my-app/src/lib/supabase/supabaseClient.ts) — [my-app/src/lib/supabase/supabaseClient.ts](my-app/src/lib/supabase/supabaseClient.ts)  
- Core server helper: [`createClient` (server)](my-app/src/lib/supabase/supabaseServer.ts) — [my-app/src/lib/supabase/supabaseServer.ts](my-app/src/lib/supabase/supabaseServer.ts)  
- Main layout: [`RootLayout`](my-app/src/app/layout.tsx) — [my-app/src/app/layout.tsx](my-app/src/app/layout.tsx)  
- Main page: [`Home`](my-app/src/app/page.tsx) — [my-app/src/app/page.tsx](my-app/src/app/page.tsx)

If more details are required for any specific area (API shape, DB schema, or fixing the webhook/user-import), specify which area to expand.