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
import { useAuth } from '@clerk/nextjs'

import { createClient } from '../../lib/supabase/supabaseClient';


import { Button } from '@/components/ui/button';
const supabaseClient = createClient()

interface UserData {
  user_id: string;
  username: string;
  membership_type: string;
  created_at: string;
  //paid_for?: boolean;
}

export default function MembershipPage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [daysSinceLastBooking, setDaysSinceLastBooking] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    const clerkId = user.id;

    async function fetchUserData(clerkId: string) {
      console.log('Fetching user with clerk_id:', clerkId);
      
      const { data, error } = await supabaseClient
        .from('users')
        .select('user_id, username, membership_type, created_at')
        .eq('clerk_id', clerkId);
      
      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2));
        console.error('Error object:', error);
        return null;
      }
      
      console.log('Successfully fetched user data:', data);
      // data is an array without .single(), so get the first element
      return data && data.length > 0 ? data[0] : null;
    }

    async function fetchBookingCount(userId: string) {
      const { count } = await supabaseClient
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      return count || 0;
    }

    async function fetchLastBookingDate(userId: string) {
      const { data } = await supabaseClient
        .from('bookings')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data?.created_at;
    }

    async function loadUserData() {
      const data = await fetchUserData(clerkId);
      console.log('Fetched user data:', data);
      
      if (!data) {
        console.error('No user data returned');
        return;
      }
      
      setUserData(data);
      
      if (data.user_id) {
        await loadBookingStats(data.user_id);
      }
    }

    async function loadBookingStats(userId: string) {
      const count = await fetchBookingCount(userId);
      setBookingCount(count);
      
      const lastBookingDate = await fetchLastBookingDate(userId);
      if (lastBookingDate) {
        const daysDiff = Math.floor((Date.now() - new Date(lastBookingDate).getTime()) / (1000 * 60 * 60 * 24));
        setDaysSinceLastBooking(daysDiff);
      }
    }
    fetchUserData(clerkId);
    loadUserData();
  }, [isLoaded, user?.id]);

  if (!isLoaded) {
    return <div className="flex h-[calc(100vh-64px)] items-center justify-center">Loading...</div>;
  }

  if (!user) {
      return (
        <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-semibold">Please sign in to view memberships.</h2>
          <SignInButton mode="modal">
            <Button variant="secondary">Sign In</Button>
          </SignInButton>
        </div>
      );
  }

  if (!userData) {
    return <div className="flex h-[calc(100vh-64px)] items-center justify-center">Fetching membership...</div>;
  }

  const handleUpgrade = async () => {
    await supabaseClient
      .from('users')
      .update({ membership_type: 'Birdie' })
      .eq('clerk_id', user.id);

    setUserData((prev) => (prev ? { ...prev, membership_type: 'Birdie' } : prev));
    alert("Your membership has been upgraded to Birdie.");
  };
  const handleDowngrade = async () => {
    await supabaseClient
      .from('users')
      .update({ membership_type: 'Par' })
      .eq('clerk_id', user.id);
    setUserData((prev) => (prev ? { ...prev, membership_type: 'Par' } : prev));
    alert("Your membership has been downgraded to Par.");
  };

  if (userData?.membership_type === null) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold">You do not have a membership yet.</h2>
        <SignUpButton mode="modal">
            <Button variant="secondary">Get Membership</Button>
          </SignUpButton>
      </div>
    );
  }

  if (userData?.membership_type === "Par") {
    return (
      <main className="relative flex justify-center h-[calc(100vh-64px)] overflow-hidden">
          <div className="bg-[url('/contact-us-background.png')] bg-cover bg-center blur-lg scale-105 h-[calc(100vh-64px)] w-full absolute inset-0 bg-cover bg-center blur-lg scale-105" />
      <div className="relative z-10 p-10 flex flex-col">
          <h3 className="text-4xl font-bold mb-4 text-center text-white">Welcome {userData?.username}</h3>
          <h3 className="text-2xl font-bold mb-4 text-center text-white">Thank you for being a {userData?.membership_type} member since {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}</h3>
          <div className="grid grid-cols-3 gap-10">
            <Card className="w-50 backdrop-blur text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
                <CardHeader>
                    <CardTitle className ="text-2xl font-bold">Total Sessions</CardTitle> 
                    <CardDescription>
                      <p className="text-4xl font-bold text-black mt-2">{bookingCount}</p>
                    </CardDescription  >
                </CardHeader>
            </Card>
            <Card className="backdrop-blur text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
                <CardHeader>
                    <CardTitle className ="text-2xl font-bold">Days As Member</CardTitle> 
                    <CardDescription>
                      <p className="text-4xl font-bold text-black mt-2">{daysSinceLastBooking ?? 'N/A'}</p>
                    </CardDescription  >
                </CardHeader>
            </Card>
            <Card className="backdrop-blur text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
                <CardHeader>
                    <CardTitle className ="text-2xl font-bold">Paid For?</CardTitle> 
                    <CardDescription>
                      <p className="text-4xl font-bold text-black mt-2">{userData?.paid_for ? 'Yes' : 'No'}</p>
                      <p className="text-4xl font-bold text-black mt-2"></p>
                    </CardDescription  >
                </CardHeader>
            </Card>
            
          </div>
          <div className="mt-10 text-center">
          </div>
          <h3 className="text-2xl mt-10 font-bold mb-4 text-center text-white">Would you like to Upgrade to a Birdie Membership?</h3>
          <Card className="backdrop-blur w-100 h-58 self-center text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
            <CardHeader>
                <CardTitle className = " text-2xl font-bold">Birdie Membership</CardTitle>
                <CardDescription>
                    <p className="p-3 text-md font-bold text-black/80">Upgrade to our premium Birdie Membership and unlock unlimited simulator use. Elevate your game with Birdie Membership today!</p>
                    <Button variant="secondary" className="mt-4" onClick={handleUpgrade}>
                      Upgrade Today
                    </Button>
                </CardDescription>
            </CardHeader>
          </Card>


      </div>
      </main>
    );
  }

  if (userData?.membership_type === "Birdie") {
    return (
      <main className="relative flex justify-center h-[calc(100vh-64px)] overflow-hidden">
          <div className="bg-[url('/contact-us-background.png')] bg-cover bg-center blur-lg scale-105 h-[calc(100vh-64px)] w-full absolute inset-0 bg-cover bg-center blur-lg scale-105" />
      <div className="relative z-10 p-10 flex flex-col">
          <h3 className="text-4xl font-bold mb-4 text-center text-white">Welcome {userData?.username}</h3>
          <h3 className="text-2xl font-bold mb-4 text-center text-white">Thank you for being a {userData?.membership_type} member since {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}</h3>
          <div className="grid grid-cols-3 gap-10">
            <Card className="w-50 backdrop-blur text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
                <CardHeader>
                    <CardTitle className ="text-2xl font-bold">Total Sessions</CardTitle> 
                    <CardDescription>
                      <p className="text-4xl font-bold text-black mt-2">{bookingCount}</p>
                    </CardDescription  >
                </CardHeader>
            </Card>
            <Card className="backdrop-blur text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
                <CardHeader>
                    <CardTitle className ="text-2xl font-bold">Days As Member</CardTitle> 
                    <CardDescription>
                      <p className="text-4xl font-bold text-black mt-2">{daysSinceLastBooking ?? 'N/A'}</p>
                    </CardDescription  >
                </CardHeader>
            </Card>
            <Card className="backdrop-blur text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
                <CardHeader>
                    <CardTitle className ="text-2xl font-bold">Paid For?</CardTitle> 
                    <CardDescription>
                      <p className="text-4xl font-bold text-black mt-2">{userData?.paid_for ? 'Yes' : 'No'}</p>
                      <p className="text-4xl font-bold text-black mt-2"></p>
                    </CardDescription  >
                </CardHeader>
            </Card>
            
          </div>
          <div className="mt-10 text-center">
          </div>
          <h3 className="text-2xl mt-10 font-bold mb-4 text-center text-white">Would you like to downgrade to a Par Membership?</h3>
          <Card className="backdrop-blur w-100 h-58 self-center text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
            <CardHeader>
                <CardTitle className = " text-2xl font-bold">Par Membership</CardTitle>
                <CardDescription>
                    <p className="p-3 text-md font-bold text-black/80">Downgrade to our standard Par Membership and enjoy our facilities at full price. Manage your membership preferences with ease today!</p>
                    <Button variant="secondary" className="mt-4" onClick={handleDowngrade}>
                      Downgrade Today
                    </Button>
                </CardDescription>
            </CardHeader>
          </Card>


      </div>
      </main>
    );
  }
}