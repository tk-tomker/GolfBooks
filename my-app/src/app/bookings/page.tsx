"use client"

import { useRouter } from "next/navigation";
import NextBooking from '../../components/NextBooking'; 
import { Button } from '@/components/ui/button';



//imports components needed for card and calendar from component library.

import { Navbar } from '../../components/ui/navbar';

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

import { createClient } from '../../lib/supabase/supabaseClient';
const supabaseClient = createClient()

export default function BookingsPage() {
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
      .select('booking_id, start_time')
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

  const handleDelete = async (bookingId: string) => {
    const { error } = await supabaseClient
      .from('bookings')
      .delete()
      .eq('booking_id', bookingId);

    setBookings(bookings?.filter((b: any) => b.booking_id !== bookingId) || null);

    alert("Booking deleted");
  };


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
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center space-y-4">
        <h2 className="text-9xl font-semibold">🔒</h2>
        <h2 className="text-2xl font-semibold">You must be signed in</h2>
        <SignInButton mode="modal">
            <Button variant="secondary">Sign in</Button>
          </SignInButton>
      </div>
    );
  }

  const clerkId = user?.id;
  return (
    <SignedIn>
      <div className="min-h-screen flex flex-col">  
        <main className="flex flex-1">
          <section className="w-1/2 p-4 border-r">
            <NextBooking bookings={bookings} internalUserId={internalUserId}/>
          </section>
          <section className="w-1/2 p-4 border-r overflow-auto text-center">
            <h3 className="text-2xl font-semibold mb-4 text-center">All Bookings</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <td>
                    <th>Date</th>
                  </td>
                  <td>
                    <th>Start Time</th>
                  </td>
                  <td>
                    <th>Delete</th>
                  </td>

                </thead>
                <tbody>
                    {bookings && bookings.length > 0 ? (
                      bookings.map((booking: any, index: number) => {
                        const bookingDate = new Date(booking.start_time);
                        return (
                          <tr key={index} className="border-t">
                            <td className="border px-4 py-2">{bookingDate.toDateString()}</td>
                            <td className="border px-4 py-2">{bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="border px-4 py-2">
                              <Button variant="destructive" onClick={() => handleDelete(booking.booking_id)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="border px-4 py-2 text-center">
                          No bookings found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
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