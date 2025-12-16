// src/components/ui/navbar.tsx
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

export function Navbar() {
  return (
    <nav className="flex w-full items-center p-4 border-b bg-white">
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
          <Link href="/chats">Chats</Link>

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
          <Link href="/contact-us">Contact Us</Link>

          </Button>
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

        {/* <SignedIn>
          <UserButton />
        </SignedIn> */}
      </div>
    </nav>
  );
}