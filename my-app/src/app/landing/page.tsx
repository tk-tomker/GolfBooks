"use client"

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/"); // Redirect to main page after login
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-200">
      <h1 className="text-4xl font-bold mb-4">GolfBooks</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        The easiest way to manage your golf club’s books, live feeds, and chats. Try it now!
      </p>
      <SignInButton mode="modal">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          Login
        </button>
      </SignInButton>
    </div>
  );
}