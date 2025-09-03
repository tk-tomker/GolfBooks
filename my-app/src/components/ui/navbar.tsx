import { Button } from "@/components/ui/button";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export function Navbar() {
    return(
        <nav className="w-full flex items-center justify-between p-4 border-b bg-white">
            <div className="flex gap-2">
                <Button variant="outline">Logo</Button>
                <Button variant="outline">Bookings</Button>
                <Button variant="outline">Chats</Button>
                <Button variant="outline">About Us</Button>
                <Button variant="outline">Contact Us</Button>
                <Button variant="outline">Profile</Button>
                <ClerkProvider>
                    <html lang="en">
                        <body className="antialiased">
                        <header className="flex justify-end items-center p-4 gap-4 h-16">
                            <SignedOut>
                            <SignInButton />
                            <SignUpButton>
                                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                Sign Up
                                </button>
                            </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                            <UserButton />
                            </SignedIn>
                        </header>
                        
                        </body>
                    </html>
                    </ClerkProvider>
            </div>
        </nav>

    );
}