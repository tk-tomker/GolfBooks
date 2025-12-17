"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingsPage() {
  

  return (
    <>
    <main className ="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-100 to-white-100">
        <h1 className="text-6xl p-6 font-extrabold" >About Us</h1>
        <h2 className="text-3xl p-3 font-bold ">Play Anytime, Anywhere</h2>
        <p>Our high-tech golf simulators let you enjoy the game no matter the weather or time of day.</p>
        <h2 className="text-3xl p-3 font-bold">Perfect Your Game</h2>
        <p>Track your swing, analyse your performance, and improve with every session.</p>
        <h2 className="text-3xl p-3 font-bold">Fun for Everyone</h2>
        <p>From beginners to pros, solo or with friends, our simulators make golf accessible and exciting</p>
        <h2 className="text-3xl p-3 font-bold">Easy Booking, Seamless Experience</h2>
        <p>Reserve your slot in seconds and focus on what really matters—your game.</p>
        <img src="/about-us-image.png" alt="About Us Illustration" className="mt-6 w-3/8 h-auto rounded-lg shadow-lg"/>
    </main>
    </>
    )
}