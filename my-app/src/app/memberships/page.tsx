"use client"

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card';


import {
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  SignedOut,
  SignUpButton,
} from '@clerk/nextjs';

import { useState, useEffect } from 'react';

import { createClient } from '../../lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
const supabaseClient = createClient()

interface UserData {
  user_id: string;
  username: string;
  membership_type: string;
  created_at: string;
}

export default function MembershipPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState(null);
  const [internalUserId, setInternalUserId] = useState(null);


  useEffect(() => {
    const clerkId = user?.id;

    async function fetchUserData(clerkId: string) {
      const { data } = await supabaseClient
        .from('users')
        .select('user_id, username, membership_type, created_at')
        .eq('clerk_id', clerkId)
        .single();
      return data;
    }

    fetchUserData(clerkId).then(data => {
      setUserData(data);
    });
  }, [isLoaded, user]);


  return (
    <main className="relative flex justify-center h-[calc(100vh-64px)] overflow-hidden">
        <div className="bg-[url('/contact-us-background.png')] bg-cover bg-center blur-lg scale-105 h-[calc(100vh-64px)] w-full absolute inset-0 bg-cover bg-center blur-lg scale-105" />
    <div className="relative z-10 p-10">
        <h3 className="text-4xl font-bold mb-4 text-center text-white">Welcome {userData?.username}</h3>
        <h3 className="text-2xl font-bold mb-4 text-center text-white">Thank you for being a {userData?.membership_type} member since {new Date(userData?.created_at).toLocaleDateString()}</h3>
    </div>
    </main>
  )
}
