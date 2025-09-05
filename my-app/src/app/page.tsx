'use client';                     
//'use client' means the code will run in the browser


//Manages state in functional componenets and handles side effects after rendering
import { useEffect, useState } from 'react';

//
import { createClient } from '../lib/supabaseServer';


//imports the supabase client instance from a local file. Allows interaction with supabase backend
import {supabase } from '../lib/supabaseClient'

//imports a component from the components library
import NextBooking from '@/components/NextBooking'; 

//imports components needed for card and calendar from component library.
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import Calendar20 from '../components/ui/calendar-20';
import { Navbar } from '../components/ui/navbar';

//imports components needed for authentication from clerk
import {
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  SignedOut,
  SignUpButton,
} from '@clerk/nextjs';


//imports useAuth which provides access to authentication state.
import { useAuth } from '@clerk/nextjs'

//defines and exports a react functional component
export default function Home() {
//-------------------------------Pre-requisites for components functionality---------------------------
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { user, isLoaded, isSignedIn, userId, sessionId } = useAuth();

  const [supabaseUser, setSupabaseUser] = useState<{ user_id: string } | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient();
      const { data,} = await supabase
        .from('users')
        .select('user_id')
        .eq('clerk_id', 123)
        .single()

      if (data) {
        setSupabaseUser(data);
      } else {
        setSupabaseUser(null)
      }
      
    };
    fetchData();
  }, []);

 //if the page hasn't loaded, show 'Loading...'
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

 
  //if noone is signed in display 'You must be signed in'
  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold">You must be signed in</h2>
      </div>
    );
  }


  // supabaseUser can either be an object with user_id: string, or null


  return 








//-------------------Main functionality of the component---------------------------------
  return (
    <SignedIn>
      <div className="min-h-screen flex flex-col">  
        <main className="flex flex-1">
          <section className="w-1/4 p-4 border-r">
            <h2 className="text-lg font-semibold mb-4">Live Feed for<pre>{JSON.stringify(supabaseUser, null)}</pre>;</h2>
          </section>

          
          <section className="flex-1 p-4 border-r">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Upcoming Bookings
            </h2>

          
            <section className="p-4 grid grid-cols-3 gap-4 border border-red-400">
              <Card className="w-40 h-35">
                <CardHeader>
                  <CardTitle>MON 17th </CardTitle>
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

    
          <section className="w-1/4 p-4">
            <h2 className="text-lg font-semibold mb-4">Chats</h2>
          </section>
        </main>

        
        <footer className="p-4 border-t flex items-center justify-end">
          <span className="mr-2">
            Logged in as {user?.firstName ?? '…'}
          </span>
          <UserButton />
        </footer>
      </div>
    </SignedIn>
  );
}



// export default function NextBooking({ userId }: { userId: string }) {
//   const [nextDate, setNextDate] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchNextBooking() {
//       const { data, error } = await supabase
//         .from('bookings')
//         .select('start_time')
//         .eq('user_id', userId)
//         .gt('start_time', new Date().toISOString())
//         .order('start_time', { ascending: true })
//         .limit(1)
//         .single()

//       if (error) {
//         console.error('Error loading next booking:', error)
//         setNextDate(null)
//       } else if (data) {
//         const local = new Date(data.start_time).toLocaleString()
//         setNextDate(local)
//       }
//       setLoading(false)
//     }

//     fetchNextBooking()
//   }, [userId])

//   if (loading) return <p>Loading…</p>
//   if (!nextDate) return <p>No upcoming bookings.</p>

//   return <p>Next booking: {nextDate}</p>
// }