'use client' //indicates this is a client-side component

//imports a section components from the components library
import NextBooking from '../components/NextBooking'; 
import LiveFeed from '../components/LiveFeed';
import Chat from '../components/Chat';

//imports components needed for card and calendar from component library.

import { Navbar } from '../components/ui/navbar';

//imports components needed for authentication from clerk
import {
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  SignedOut,
  SignUpButton,
} from '@clerk/nextjs';


//imports useAuth which provides access to authentication state.
import { useAuth } from '@clerk/nextjs'

import { useState, useEffect } from 'react';

import { createClient } from '../lib/supabase/supabaseClient';
const supabaseClient = createClient()

//defines and exports a react functional component
export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState(null);

  const [bookings, setBookings] = useState(null);
  const [internalUserId, setInternalUserId] = useState(null);


  // Wait until user is loaded and signed in before fetching
  useEffect(() => {
    if (!isLoaded || !user) return;

    async function fetchUserBookings(clerkId: string) {
      const { data:dbUser , error: userError } = await supabaseClient
        .from('users')
        .select('user_id')
        .eq('clerk_id', clerkId)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      const supabaseId = dbUser?.user_id;
        setInternalUserId(supabaseId);

      const { data: bookings, error: bookingsError} = await supabaseClient
      .from('bookings')
      .select('start_time')
      .eq('user_id', supabaseId);

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        return;
      }
      return bookings;
    }
    fetchUserBookings(user.id).then(bookings => {
      setUserData(bookings);
      setBookings(bookings);
    });
}, [isLoaded, user]);


  // Show loading if user not loaded
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  // Show message if not signed in
  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold">You must be signed in</h2>
      </div>
    );
  }

  const clerkId = user?.id;
  return (
    <SignedIn>
      <div className="min-h-screen flex flex-col">  
        <main className="flex flex-1">
          <section className="w-1/4 p-4 border-r"> 
            <LiveFeed user={internalUserId}  />
          </section>
          <section className="flex-1 p-4 border-r">
            <NextBooking bookings={bookings} internalUserId={internalUserId} />
          </section>
          <section className="w-1/4 p-4">
            <Chat />
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