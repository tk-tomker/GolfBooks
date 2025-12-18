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

export default function Chats() {
  const { user, isLoaded, isSignedIn } = useUser();
    
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
    <main className ="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-100 to-white-100">
      <h1>Testing</h1>
    </main>
  )
}