"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  SignedOut,
  SignUpButton,
} from '@clerk/nextjs';

import { Button } from "@/components/ui/button";

import { useAuth } from '@clerk/nextjs'

import { useState } from 'react';

import { createClient } from "@/lib/supabase/supabaseClient";
const supabaseClient = createClient()

interface UserData {
  username: string;
  email: string;
  created_at: string;
  membership_type: string;
  role: string;
}

export default function Chats() {
  const [userData, setUserData] = useState<UserData[] | null>(null);

  const [bookings, setBookings] = useState(null);
  const [internalUserId, setInternalUserId] = useState(null);
  const { user, isLoaded, isSignedIn } = useUser();
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


  return (
    <section className="p-4 overflow-auto text-center">
      <h2 className="text-lg font-semibold mb-4">Members Directory</h2>
      <div className="items-center text-center rounded-lg bg-gray-100 border shadow-md p-2 m-2">
        <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Membership Type</th>
                      <th>Membership Since</th>
                      <th>Admin?</th>
                    </tr>
                  </thead>
                  <tbody>
                      {userData && userData.length > 0 ? (
                        userData.map((userData: any, index: number) => {
                          return (
                            <tr key={index} className="border-3 rounded border-[#0d5420] bg-transparent bg-blur-40 hover:bg-[#1e3a32]/60  transition-all duration-200 ">
                              <td className="px-4 py-2">{userData.username}</td>
                              <td className="px-4 py-2">{userData.email}</td>
                              <td className="px-4 py-2">{userData.membership_type}</td>
                              <td className="px-4 py-2">{new Date(userData.created_at).toLocaleDateString()}</td>
                              <td className="px-4 py-2">{userData.role === 1 ? "Admin" : "Member"}</td>
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
          </div>
    </section>
  )
}