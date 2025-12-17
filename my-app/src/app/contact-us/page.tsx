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
    <>
    <main className="flex items-center justify-center align-center h-[calc(100vh-64px)] bg-gradient-to-b from-gray-100 to-white-100">
        <Card className="backdrop-blur w-100 h-58 self-center text-center bg-[white]/70  hover:backdrop-blur transition-all duration-200 hover:bg-[#1e3a32] hover:text-white hover:scale-105">
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
    </>
  )
}

