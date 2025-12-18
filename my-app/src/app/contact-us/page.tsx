"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card';

export default function ContactUsPage() {
  

  return (
    <main className="bg-[url('/contact-us-background.png')] bg-cover bg-center flex items-center justify-center align-center h-[calc(100vh-64px)]">
        <Card className="backdrop-blur w-100 h-58 self-center text-center bg-[white]/40 scale-105  hover:backdrop-blur transition-all duration-200 hover:bg-[white]/70 ease-in-out hover:scale-108">
            <CardHeader>
                <CardTitle className = " text-2xl font-bold">Contact Us</CardTitle>
                <CardDescription>
                    <h2 className="text-xl p-3 font-bold ">Email:</h2>
                    <p>GolfBooks@example.com</p>
                    <h2 className="text-xl p-3 font-bold">Phone</h2>
                    <p>07123 456789</p>
                </CardDescription  >
            </CardHeader>
        
        
        </Card>
    </main>
  )
}

