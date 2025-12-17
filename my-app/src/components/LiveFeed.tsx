import { useUser } from "@clerk/nextjs"; // adjust import if needed

export default function LiveFeed({user}) {
//   const {user, isLoaded, isSignedIn } = useUser();

  return (
    <section className="p-4 overflow-auto text-center text-gray-200 shadow-lg">
    <h2 className="text-lg font-semibold mb-4">
       {user ? `Live Feed` : "Live Feed for Loading user…"}
    </h2>
    <h3 className="text-2xl font-semibold mb-4 text-center underline">All Updates</h3>
            <div className="w-full overflow-x-auto text-center">
              <table className=" table-auto w-full border-collapse">
                <thead>
                  <td>
                    <th className="p-2 text-center">Messages</th>
                  </td>
                  <td>
                    <th className="p-2 text-center">Author</th>
                  </td>

                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </section>

  );
}