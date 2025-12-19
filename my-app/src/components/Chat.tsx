"use client"

import { useRouter } from "next/navigation";
import NextBooking from "./NextBooking";
import { Button } from '@/components/ui/button';



//imports components needed for card and calendar from component library.

import { Navbar } from "./ui/navbar";

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

import { createClient } from "@/lib/supabase/supabaseClient";
const supabaseClient = createClient()

interface UserData {
  username: string;
  email: string;
  created_at: string;
  membership_type: string;
  role: string;
}

export default function Chat() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState<UserData[] | null>(null);

  const [bookings, setBookings] = useState(null);
  const [internalUserId, setInternalUserId] = useState(null);
useEffect(() => {
    async function fetchUsers() {
      // Call the function to fetch bookings
      const { data } = await supabaseClient
        .from('users')
        .select('username, email, created_at, membership_type, role')
        
        setUserData(data);
    }

    if (user?.id) {
      fetchUsers();   
    }
});

  return (
    <section className="p-4 overflow-auto text-center text-gray-200 ">
      <h2 className="text-2xl font-semibold mb-4">Members Directory</h2>
      <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Membership Type</th>
                  </tr>
                </thead>
                <tbody>
                    {userData && userData.length > 0 ? (
                      userData.map((userData: any, index: number) => {
                        return (
                          <tr key={index} className="border-3 rounded border-[#0d5420] bg-transparent bg-blur-40 hover:bg-[#1e3a32]  transition-all duration-200 ">
                            <td className="px-4 py-2">{userData.username}</td>
                            <td className="px-4 py-2">{userData.email}</td>
                            <td className="px-4 py-2">{userData.membership_type}</td>
                    
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="border px-4 py-2 text-center">
                          No users found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
    </section>
  )
}