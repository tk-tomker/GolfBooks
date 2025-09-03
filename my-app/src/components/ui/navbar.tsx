// src/components/ui/navbar.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

export function Navbar() {
  return (
    /**
     * 1️⃣ `flex w-full`   → full‑width flex bar
     * 2️⃣ `items-center`  → vertical centering
     * 3️⃣ `p-4 border-b bg-white` → visual styling you already had
     */
    <nav className="flex w-full items-center p-4 border-b bg-white">
      {/* -------------------------------------------------
       * LEFT SECTION – every normal navigation button
       * ------------------------------------------------- */}
      <div className="flex items-center gap-2">
        <Button variant="secondary">Logo</Button>
        <Button variant="secondary">Bookings</Button>
        <Button variant="secondary">Chats</Button>
        <Button variant="secondary">About Us</Button>
        <Button variant="secondary">Contact Us</Button>
        <Button variant="secondary">Profile</Button>
      </div>

      {/* -------------------------------------------------
       * RIGHT SECTION – auth UI (Sign‑In / Sign‑Up / Avatar)
       * ------------------------------------------------- */}
      <div className="ml-auto flex items-center gap-2">
        {/* --------- Guest (signed‑out) ---------- */}
        <SignedOut>
          {/* `asChild` makes Clerk render *our* Button component,
              preserving the same look as the navigation buttons. */}
          <SignInButton mode="modal">
            <Button variant="secondary">Sign in</Button>
          </SignInButton>

          <SignUpButton mode="modal" >
            <Button>Sign up</Button>
          </SignUpButton>
        </SignedOut>

        {/* --------- Logged‑in (signed‑in) ---------- */}
        <SignedIn>
          {/* UserButton already contains the avatar + dropdown */}
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}