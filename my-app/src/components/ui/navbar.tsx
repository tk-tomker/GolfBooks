// src/components/ui/navbar.tsx
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
        {/* </Button> */}
        <Button
        variant="secondary"
          className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
        >
          Bookings
        </Button>
        <Button
          variant="secondary"
          className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
        >
          Chats
        </Button>
        <Button
          variant="secondary"
          className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105"
        >
          About Us
        </Button>
        <Button 
        variant="secondary"
        className="transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105">
          Contact Us
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