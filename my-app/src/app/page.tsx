import { Navbar } from "../components/ui/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className ="flex flex-1">
        <section className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-semibold mb-4">Live Feed</h2>
        </section>

        <section className="flex-1 p-4 border-r">
          <h2 className="text-2xl font-semibold mb-4">Main Content Area</h2>
        </section>

        <section className="w-1/4 p-4">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
        </section>
      </main>
    </div>
  );
}
