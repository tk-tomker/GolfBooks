'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NextBooking({ userId }: { userId: string }) {
  const [nextDate, setNextDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNextBooking() {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('user_id', userId)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (error) {
        console.error('Error loading next booking:', error)
        setNextDate(null)
      } else if (data) {
        const local = new Date(data.start_time).toLocaleString()
        setNextDate(local)
      }
      setLoading(false)
    }

    fetchNextBooking()
  }, [userId])

  if (loading) return <p>Loading…</p>
  if (!nextDate) return <p>No upcoming bookings.</p>

  return <p>Next booking: {nextDate}</p>
}