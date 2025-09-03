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
} from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import Calendar20 from "../components/ui/calendar-20";
import { useState } from "react";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className ="flex flex-1">
        {/*-----------LIVE FEED SECTION-------------*/}
        <section className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-semibold mb-4">Live Feed</h2>
        </section>
        {/*-----------BOOKINGS SECTION-------------*/}
        <section className="flex-1 p-4 border-r ">
          <h2 className="text-2xl font-semibold mb-4 text-center">Upcoming Bookings</h2>
            <section className="p-4 grid grid-cols-3 md:gap-50 border border-red-400">
              <Card className="w-40 h-35">
                <CardHeader>
                  <CardTitle>MON 17th</CardTitle>
                  <CardDescription>@ 17:30</CardDescription>
                
                </CardHeader>
              </Card>
              <Card className="w-40">
                <CardHeader>
                  <CardTitle>SAT 28th</CardTitle>
                  <CardDescription>@ 13:00</CardDescription>
                 
                </CardHeader>
              </Card>
              <Card className="w-40">
                <CardHeader>
                  <CardTitle>FRI 2nd</CardTitle>
                  <CardDescription>@ 17:30</CardDescription>
                </CardHeader>
              </Card> 
            </section>
            <section className="p-10 border border-red-400">
              <Calendar20
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
            </section>
        </section>
        {/*-----------CHATS SECTION-------------*/}
        <section className="w-1/4 p-4">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
        </section>
      </main>
    </div>
  );
}

