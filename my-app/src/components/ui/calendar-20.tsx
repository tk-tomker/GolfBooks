"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

//IMPORT Supabase client
import { createClient } from "@/lib/supabase/supabaseClient"


const supabase = createClient()\

export default function Calendar20({internalUserId, clerkId}) {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [selectedTime, setSelectedTime] = React.useState<string | null>("10:00")
  //ADD button loading state
  const [loading, setLoading] = React.useState(false)
  //ADD feedback message
  const [message, setMessage] = React.useState<string | null>(null)


  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = Array.from(
    { length: 3 },
    (_, i) => new Date(2025, 5, 17 + i)
  )

  //NEW FUNCTION handles booking insertion to supabase
  const handleBooking = async () => {
    if (!date || !selectedTime || !internalUserId) return

    setLoading(true)
    setMessage(null)
    
    try {
      const formattedDate = date.toISOString().split("T")[0]
      const startTime = `${formattedDate}T${selectedTime}:00Z`

      const { data, error } = await supabase
        .from("bookings")
        .insert([
        {
          user_id: internalUserId,
          room_id: "17c5a53c-545b-42ff-98e4-5e5da9537688", // temp test
          start_time: startTime,
          duration: "1 hour",
          paid_for: false,
          clerk_id: clerkId
        }
      ])
      if (error) throw error
        setMessage("✅ Booking saved successfully!")
    } catch (err: unknown) {
        console.error("SUPABASE ERROR:", err)
        setMessage("❌ " + err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={bookedDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("en-US", { weekday: "short" })
              },
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Your meeting is booked for{" "}
              <span className="font-medium">
                {" "}
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
              </span>
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
        <Button
        //added next two lines
          disabled={!date || !selectedTime || loading}
          onClick={handleBooking}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
        >
          {loading ? "Booking..." : "Continue"}
        </Button>
      </CardFooter>
      {/* show confirmation or error */}
      {message && (
        <p className="px-6 pb-4 text-sm text-center text-muted-foreground">
          {message}
        </p>
      )}
    </Card>
  )
}
