import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import Calendar20 from '../components/ui/calendar-20';

import { useState } from 'react';

export default function NextBooking() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Upcoming Bookings
      </h2>

      <section className="p-4 grid grid-cols-3 gap-4 border border-red-400">
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
    </div>
  );
}
