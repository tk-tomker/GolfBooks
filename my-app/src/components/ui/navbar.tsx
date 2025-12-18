// src/components/ui/navbar.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from "next/link";
import { createClient } from '@/lib/supabase/supabaseClient';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

export function Navbar() {
  const { user, isLoaded } = useUser();
  const supabase = useMemo(() => createClient(), []);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    if (!isLoaded || !user) {
      setIsAdmin(false);
      return;
    }

    const fetchRole = async () => {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('clerk_id', user.id)
        .single();

      setIsAdmin(data?.role === 1);
    };

    fetchRole();
  }, [isLoaded, supabase, user]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center p-4 border-b bg-white h-16">
      <div className="flex items-center gap-2">
        {/* <Button variant="secondary"> */}
        <Link href="/">  
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="mr-2 transition-all duration-200 hover:scale-105"
            objectFit='cover'
            quality={100}
            style={{borderRadius: '8px'}}
          />
        </Link>
        {/* </Button> */}
        <Button
          variant="secondary"
          className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
        >
          <Link href="/bookings">Bookings</Link>
        </Button>
          
          
          
        <Button
          variant="secondary"
          className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
        >
          <Link href="/chats">Members Directory</Link>

        </Button>
        <Button
          variant="secondary"
          className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
        >
          <Link href="/about-us">About Us</Link>

        </Button>

        <Button 
        variant="secondary"
        className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105">
          <Link href="/memberships">Your Membership</Link>

        </Button>
        
        <Button 
        variant="secondary"
        className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105">
          <Link href="/contact-us">Contact Us</Link>

          </Button>

        

        {isAdmin && (
          <Button
            variant="secondary"
            className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
          >
            <Link href="/admin">Admin</Link>
          </Button>
        )}
      </div>

 
      <div className="ml-auto flex items-center gap-2">
 
        <SignedOut>
      
          <SignInButton mode="modal">
            <Button variant="secondary">Sign in</Button>
          </SignInButton>

          <SignUpButton mode="modal" >
            <Button>Sign up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* <SignedIn>
          <UserButton />
        </SignedIn> */}
      </div>
    </nav>
  );
}