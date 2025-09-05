// app/page.tsx   (or app/home/page.tsx – whichever route you prefer)
'use client';                     // 👈 This file runs in the browser

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import Calendar20 from '../components/ui/calendar-20';
import { Navbar } from '../components/ui/navbar';

import {
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  SignedOut,
  SignUpButton,
} from '@clerk/nextjs';

export default function Home() {
  /* -------------------------------------------------------------
   * 1️⃣ Local UI state – the date selected on the calendar
   * ------------------------------------------------------------- */
  const [date, setDate] = useState<Date | undefined>(undefined);

  /* -------------------------------------------------------------
   * 2️⃣ Clerk client‑side hook – gives us user data & loading state
   * ------------------------------------------------------------- */
  const { user, isLoaded, isSignedIn } = useUser();

  /* -------------------------------------------------------------
   * 3️⃣ While Clerk is figuring out the session → show a spinner** */
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 4️⃣ If there is **no** signed‑in user → show sign‑in prompt
   * ------------------------------------------------------------- */
  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold">You must be signed in</h2>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 5️⃣ Signed‑in UI – everything you originally wrote
   * ------------------------------------------------------------- */
  return (
    <SignedIn>
      <div className="min-h-screen flex flex-col">
            
        <main className="flex flex-1">
         
          <section className="w-1/4 p-4 border-r">
            <h2 className="text-lg font-semibold mb-4">Live Feed</h2>
          </section>

          
          <section className="flex-1 p-4 border-r">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Upcoming Bookings
            </h2>

          
            <section className="p-4 grid grid-cols-3 gap-4 border border-red-400">
              <Card className="w-40 h-35">
                <CardHeader>
                  <CardTitle>MON 17th</CardTitle>
                  <CardDescription>@ 17:30</CardDescription>
                </CardHeader>
              </Card>

              <Card className="w-40">
                <CardHeader>
                  <CardTitle>SAT 28th</CardTitle>
                  <CardDescription>@ 13:00</CardDescription>
                </CardHeader>
              </Card>

              <Card className="w-40">
                <CardHeader>
                  <CardTitle>FRI 2nd</CardTitle>
                  <CardDescription>@ 17:30</CardDescription>
                </CardHeader>
              </Card>
            </section>

            
            <section className="p-10 border border-red-400">
              <Calendar20
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
            </section>
          </section>

    
          <section className="w-1/4 p-4">
            <h2 className="text-lg font-semibold mb-4">Chats</h2>
          </section>
        </main>

        
        <footer className="p-4 border-t flex items-center justify-end">
          <span className="mr-2">
            Logged in as {user?.firstName ?? '…'}
          </span>
          <UserButton />
        </footer>
      </div>
    </SignedIn>
  );
}
