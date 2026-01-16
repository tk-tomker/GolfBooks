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
import LiveFeed from "@/components/LiveFeed";
import { Router } from "lucide-react";
const supabaseClient = createClient()

type Member = {
  user_id: string;
  username: string;
  email: string;
  membership_type: string;
  role?: string;
  membership_paid?: boolean;
};

export default function BookingsPage() {
    const router = useRouter();

    const { user, isLoaded, isSignedIn } = useUser();
    const [userData, setUserData] = useState<Member[]>([]);
    const [userName, setUserName] = useState(null);

    const [bookings, setBookings] = useState<any[]>([]);
    const [internalUserId, setInternalUserId] = useState(null);

    const [username, setUsername] = useState<string>("");
    const [content, setContent] = useState<string>("");
    
    const [message, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const sendMessage = async () => {
        const {error} = await supabaseClient
        .from('messages')
        .insert({ content: content, username: username})

        alert("Message Posted");
    }

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
      .select('booking_id, start_time, user_id, paid_for');

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        return;
      }

      // Fetch usernames for each booking
      const bookingsWithUsernames = await Promise.all(
        (bookings || []).map(async (booking: any) => {
          const { data: userData } = await supabaseClient
            .from('users')
            .select('username, email, membership_type')
            .eq('user_id', booking.user_id)
            .single();
          
          return {
            ...booking,
            username: userData?.username || 'Unknown'
          };
        })
      );

      console.log('Bookings data:', bookingsWithUsernames);
      return bookingsWithUsernames;
    }

    async function fetchUsers() {
        const { data, error } = await supabaseClient
          .from('users')
          .select('user_id, username, email, created_at, membership_type, role, membership_paid');

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        setUserData(data ?? []);
      }
  
      if (user?.id) {
        fetchUsers();   
      }
    const fetchMessages = async () => {
      const {data} = await supabaseClient
        .from('messages')
        .select('content, username, created_at, message_id');
    

    setMessages(data ?? []);
    };

    fetchMessages();
    
    

    

    
    fetchUserBookings(user.id).then(bookings => {
      setBookings(bookings ?? []);
    });
}, [isLoaded, user]);

  const handlePaid = async (bookingId: string) => {
    const { error } = await supabaseClient
      .from('bookings')
      .update({ paid_for: true })
      .eq('booking_id', bookingId);

    // setBookings(bookings?.filter((b: any) => b.booking_id !== bookingId) || null);

    alert("Balance Updated");
  };

  const handlePaidMembership = async (userId: string) => {
    const { error } = await supabaseClient
      .from('users')
      .update({ membership_paid: true })
      .eq('user_id', userId);

    // setBookings(bookings?.filter((b: any) => b.booking_id !== bookingId) || null);

    alert("Balance Updated");
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
            <main className="flex flex-1 bg-gradient-to-b from-gray-50 to-white-100">
                <section className="w-1/2 p-4 border-r overflow-auto text-center flex flex-col">
                    <div></div>
                        <h3 className="text-2xl font-semibold mb-4 text-center">All Bookings</h3>
                        <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>Username</th>
                                <th>Paid For</th>
                            </tr>

                            </thead>
                            <tbody>
                                {bookings && bookings.length > 0 ? (
                                bookings.map((booking: any) => {
                                    const bookingDate = new Date(booking.start_time);
                                    const member = userData.find((member) => member.user_id === booking.user_id);

                                    return (
                                    <tr key={booking.booking_id} className="border-t">
                                        <td className="border px-4 py-2">{bookingDate.toDateString()}</td>
                                        <td className="border px-4 py-2">{bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="mb-2 p-2 text-center ">{booking?.username ?? "-"}</td>
                                        <td className="border px-4 py-2">
                                            {booking.paid_for === true || (member.membership_type === 'Birdie' && member.membership_paid === true) ? (
                                                <span>Yes</span>
                                            ) : (
                                                <Button
                                                className="hover:bg-red-500 active:scale-95"
                                                onClick={() => handlePaid(booking.booking_id)}
                                                >
                                                Click to confirm payment
                                                </Button>
                                            )}
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
            <section className="w-1/2 p-4 border-r overflow-auto text-center flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Members Directory</h2>
                <div className="items-center text-center rounded-lg bg-gray-100 border shadow-md p-2 m-2">
                    <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Membership Type</th>
                                <th>Membership Paid For</th>
                                <th>Outstanding Balance</th>
                                
                                </tr>
                            </thead>
                            <tbody>
                                {userData && userData.length > 0 ? (
                                  userData.map(member => (
                                    <tr key={member.user_id}>
                                      <td className="px-4 py-2">{member.username}</td>
                                      <td className="px-4 py-2">{member.email}</td>
                                      <td className="px-4 py-2">{member.membership_type}</td>
                                      <td className="px-4 py-2">
                                        {member.membership_paid === true ? (
                                          <span>Yes- Nothing Due</span>
                                        ) : member.membership_type === 'Par' ? (
                                            <span>Yes - Nothing Due</span>
                                        ) : (
                                            <Button
                                            className="hover:bg-red-500 active:scale-95"
                                            onClick={() => handlePaidMembership(member.user_id)}
                                            >
                                            Click to confirm payment
                                            </Button>
                                        )}
                                      </td>
                                      <td className="px-4 py-2">
                                        £{(() => {
                                            const unpaidCount = bookings.filter(
                                            (b: any) => b.user_id === member.user_id && b.paid_for === false
                                            ).length;
                                            
                                            const bookingCost = member.membership_type === 'Birdie' && member.membership_paid === true ? 0 : unpaidCount * 20;
                                            
                                            const membershipCost = 
                                            member.membership_type === 'Birdie' && !member.membership_paid ? 250 : 0;
                                            
                                            return bookingCost + membershipCost;
                                        })()}
                                        </td>
                                    </tr>
                                  ))
                                ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-2 text-center">Loading user data...</td>
                                </tr>
                                )}
                            </tbody>
                            </table>
                        </div>
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