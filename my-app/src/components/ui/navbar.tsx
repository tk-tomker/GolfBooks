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
        <div className="flex gap-2 w-full flex items-center justify-start p-4 border-b bg-white">
            <Button variant="outline">Logo</Button>
            <Button variant="outline">Bookings</Button>
            <Button variant="outline">Chats</Button>
            <Button variant="outline">About Us</Button>
            <Button variant="outline">Contact Us</Button>
            <Button variant="outline">Profile</Button>
        </div>
    );
}