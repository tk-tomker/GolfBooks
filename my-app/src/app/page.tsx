"use client"

import { Navbar } from "../components/ui/navbar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Calendar } from "../components/ui/calendar"
import { useState } from "react";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className ="flex flex-1">
        <section className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-semibold mb-4">Live Feed</h2>
        </section>

        <section className="flex-1 p-4 border-r">
          <h2 className="text-2xl font-semibold mb-4 text-center">Upcoming Bookings</h2>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>MON 17th</CardTitle>
                <CardDescription>@ 17:30</CardDescription>
                <CardAction></CardAction>
              </CardHeader>
              <CardContent>
                
              </CardContent>
              <CardFooter>
                
              </CardFooter>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>SAT 28th</CardTitle>
                <CardDescription>@ 13:00</CardDescription>
                <CardAction></CardAction>
              </CardHeader>
              <CardContent>
                
              </CardContent>
              <CardFooter>
                
              </CardFooter>
            </Card>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border"
            />
        </section>

        <section className="w-1/4 p-4">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
        </section>
      </main>
    </div>
  );
}
