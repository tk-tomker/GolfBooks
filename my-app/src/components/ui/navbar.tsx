// src/components/ui/navbar.tsx
'use client';

import { Button } from '@/components/ui/button';
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
        <Button variant="secondary">Logo</Button>
        <Button variant="secondary">Bookings</Button>
        <Button variant="secondary">Chats</Button>
        <Button variant="secondary">About Us</Button>
        <Button variant="secondary">Contact Us</Button>
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
      </div>
    </nav>
  );
}