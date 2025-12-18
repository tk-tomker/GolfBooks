"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import Calendar20 from '../components/ui/calendar-20';

import { useState } from 'react';
import { useUser } from "@clerk/nextjs"

//\/-------
import * as React from "react"
import createClient from "@/lib/supabase/supabaseClient"
import BookingModal from "/@/components/ui/bookingModal"
///\----------

  

export default function NextBooking({ bookings, internalUserId }) {
  const { isLoaded, user } = useUser()
  const clerkId = user?.id || null
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Upcoming Bookings
      </h2>

      <section className="p-4 grid grid-cols-3 gap-4 border rounded-lg">
        {bookings && bookings.length > 0 ? (
          bookings.slice(0, 3).map((booking, idx) => (
            <Card className="w-40 h-35 transition-all duration-200 hover:bg-[#10331e] hover:text-white hover:scale-105" key={idx}>
              <CardHeader>
                <CardTitle>{new Date(booking.start_time).toDateString()}</CardTitle>
                <CardDescription>
                  @{new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card className="w-40 h-35">
            <CardHeader>
              <CardTitle>No bookings</CardTitle>
              <CardDescription>—</CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>
      <section className="p-10">
        <Calendar20
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
          internalUserId={internalUserId}
          clerkId={clerkId}
        />
      </section>
    </div>
  );
}