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

export default function BookingsPage() {
    const router = useRouter();

    const { user, isLoaded, isSignedIn } = useUser();
    const [userData, setUserData] = useState(null);

    const [bookings, setBookings] = useState(null);
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
      .select('booking_id, start_time, user_id');


      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        return;
      }
      console.log('Bookings data:', bookings);
      return bookings;
    }
    const fetchMessages = async () => {
      const {data} = await supabaseClient
        .from('messages')
        .select('content, username, created_at, message_id');
    

    setMessages(data ?? []);
    };

    fetchMessages();
    

    

    
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

  const handleDeleteMessages = async (messageId: string) => {
    const { error } = await supabaseClient
      .from('messages')
      .delete()
      .eq('message_id', messageId);

    setMessages(message?.filter((b: any) => b.message_id !== messageId) || null);

    alert("Message deleted");
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
                <section className="w-1/2 p-4 border-r flex flex-col">
                    <div>
                        <h1 className="text-2xl font-semibold mb-4 text-center">Post a Message</h1>
                        <div className="h-50 items-center rounded-lg bg-gray-100 border shadow-md p-2 m-2 flex pt-8 pb-8">
                            <br></br>
                            <input className="items-center rounded-lg bg-gray-100 border shadow-md p-2 m-2" type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)}/>
                            <textarea className="w-full h-full rounded-lg bg-gray-100 border shadow-md p-2 m-2" placeholder="Message" value={content} onChange={(event) => setContent(event.target.value)}/>
                            <button className="w-50 rounded-lg bg-blue-500 text-white p-2 m-2 shadow-md hover:scale-103 duration-200 hover:bg-blue-600 active:scale-95" onClick={sendMessage}>Post Message</button>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold mb-4 text-center mt-5">Live Feed</h1>
                        <div className="items-center text-center rounded-lg bg-gray-100 border shadow-md p-2 m-2">
                            <div className="w-full overflow-x-auto text-center">
                                <table className=" table-auto w-full border-collapse rounded-lg">
                                <thead >
                                    <tr>
                                    <th className="p-2 text-center">Messages</th>
                                    <th className="p-2 text-center">Author</th>
                                    <th className="p-2 text-center w-1/8">Date/Time</th>
                                    <th className="p-2 text-center w-1/8">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-2">
                                    {message.map((message: any) => (
                                        <tr className="border-3 bg-transparent bg-blur-40 hover:bg-gray-200  transition-all duration-200 " key={message.message_id}>
                                        <td className="mb-2 p-2 text-center ">{message?.content}</td>
                                        <td className="mb-2 p-2 text-center ">{message?.username}</td>
                                        <td className="mb-2 p-2 text-center ">{message?.created_at? new Date(message.created_at).toLocaleString() : "-"}</td>
                                        <td className="mb-2 p-2 text-center">
                                        <Button className="hover:bg-red-500 active:scale-95" variant="destructive" onClick={() => handleDeleteMessages(message.message_id)}>
                                            Delete
                                        </Button>
                                        </td>
                                        </tr>
                                    
                                    ))} 
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-1/2 p-4 border-r overflow-auto text-center flex flex-col">
                    <div></div>
                        <h3 className="text-2xl font-semibold mb-4 text-center">All Bookings</h3>
                        <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>UserID</th>
                                <th>Delete</th>
                            </tr>

                            </thead>
                            <tbody>
                                {bookings && bookings.length > 0 ? (
                                bookings.map((booking: any) => {
                                    const bookingDate = new Date(booking.start_time);
                                    return (
                                    <tr key={booking.booking_id} className="border-t">
                                        <td className="border px-4 py-2">{bookingDate.toDateString()}</td>
                                        <td className="border px-4 py-2">{bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="mb-2 p-2 text-center ">{booking?.user_id ?? "-"}</td>
                                        <td className="border px-4 py-2">
                                        <Button className="hover:bg-red-500 active:scale-95" variant="destructive" onClick={() => handleDelete(booking.booking_id)}>
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