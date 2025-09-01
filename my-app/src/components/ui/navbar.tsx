import { Button } from "@/components/ui/button";

export function Navbar() {
    return(
        <nav className="w-full flex items-center justify-between p-4 border-b bg-white">
            <div className="flex gap-2">
                <Button variant="outline">Log In</Button>
                <Button variant="outline">Bookings</Button>
                <Button variant="outline">Chats</Button>
                <Button variant="outline">About Us</Button>
                <Button variant="outline">Contact Us</Button>
                <Button variant="outline">Profile</Button>
            </div>
        </nav>

    );
}