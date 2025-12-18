"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingsPage() {
  

  return (
  <div className="relative min-h-screen overflow-hidden">
    {/* Blurred background image */}
    <div
      className="absolute inset-0 bg-cover bg-center blur-md scale-105"
      style={{ backgroundImage: "url('/about-us-background.png')" }}
    />

    {/* Optional dark overlay for contrast */}
    {/* Page content */}
    <main className="relative z-10 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl p-6 font-extrabold text-white">About Us</h1>

      <h2 className="text-3xl p-3 font-bold text-white">
        Play Anytime, Anywhere
      </h2>
      <p className="text-white text-center">
        Our high-tech golf simulators let you enjoy the game no matter the weather or time of day.
      </p>

      <h2 className="text-3xl p-3 font-bold text-white">
        Perfect Your Game
      </h2>
      <p className="text-white text-center">
        Track your swing, analyse your performance, and improve with every session.
      </p>

      <h2 className="text-3xl p-3 font-bold text-white">
        Fun for Everyone
      </h2>
      <p className="text-white text-center">
        From beginners to pros, solo or with friends, our simulators make golf accessible and exciting
      </p>

      <h2 className="text-3xl p-3 font-bold text-white">
        Easy Booking, Seamless Experience
      </h2>
      <p className="text-white text-center">
        Reserve your slot in seconds and focus on what really matters—your game.
      </p>

      <img
        src="/about-us-image.png"
        alt="About Us Illustration"
        className="mt-6 w-3/8 h-auto rounded-lg shadow-lg"
      />
    </main>
  </div>
);

}