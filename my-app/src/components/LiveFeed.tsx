import { useUser } from "@clerk/nextjs"; // adjust import if needed

export default function LiveFeed({user}) {
//   const {user, isLoaded, isSignedIn } = useUser();

  return (
    <h2 className="text-lg font-semibold mb-4">
       {user ? `Live Feed` : "Live Feed for Loading user…"}
    </h2>
  );
}