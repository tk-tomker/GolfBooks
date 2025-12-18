import { useUser } from "@clerk/nextjs"; // adjust import if needed
import { use, useEffect, useState } from "react";
import { createClient } from "../lib/supabase/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';


const supabaseClient = createClient();

type Message = {
  content: string;
  username: string;
  created_at: string;
};


export default function LiveFeed({user}) {
//   const {user, isLoaded, isSignedIn } = useUser();
  const [message, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const {data} = await supabaseClient
        .from('messages')
        .select('content, username, created_at');
    

    setMessages(data ?? []);
    };

    fetchMessages();
}, []);

  return (
    <section className="p-4 overflow-auto text-center text-gray-200 shadow-lg rounded-lg bg-[url('/livef-feed-background.png')] bg-cover bg-center">
      <h2 className="text-2xl font-semibold mb-4">
        {user ? `Live Feed` : "Live Feed for Loading user…"}
      </h2>
      {/* <h3 className="text-2xl font-semibold mb-4 text-center underline rounded-lg">All Updates</h3> */}
      <div className="w-full overflow-x-auto text-center">
        <table className=" table-auto w-full border-collapse rounded-lg">
          <thead >
            <tr>
              <th className="p-2 text-center">Messages</th>
              <th className="p-2 text-center">Author</th>
              <th className="p-2 text-center w-1/8">Date/Time</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
              {message.map((message, index) => (
                <tr className="border-3 rounded border-[#0d5420] bg-transparent bg-blur-40 hover:bg-[#1e3a32]  transition-all duration-200 " key={index}>
                  <td className="mb-2 p-2 text-center rounded-l-lg">{message?.content}</td>
                  <td className="mb-2 p-2 text-center rounded-r-lg">{message?.username}</td>
                  <td className="mb-2 p-2 text-center rounded-r-lg">{message?.created_at? new Date(message.created_at).toLocaleString() : "-"}</td>
                </tr>
              
            ))} 
          </tbody>
        </table>
      </div>
          </section>

  );
}