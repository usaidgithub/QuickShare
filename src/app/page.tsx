"use client";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState("");

  const createRoom = () => {
    const roomId = nanoid(10); // generate unique room ID
    router.push(`/room/${roomId}`);
  };

  const joinRoom = () => {
    const trimmed = roomIdInput.trim();
    if (trimmed.length > 0) {
      router.push(`/room/${trimmed}`);
    }
  };

  return (
    // Outer container with a dark gradient background and animated blobs
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden text-gray-100">
      {/* Abstract background elements for visual interest on larger screens */}
      {/* Colors adjusted for dark mode */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-700 rounded-full mix-blend-lighten filter blur-2xl opacity-20 animate-blob lg:w-96 lg:h-96 transform -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-lighten filter blur-2xl opacity-20 animate-blob animation-delay-2000 lg:w-96 lg:h-96 transform translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-700 rounded-full mix-blend-lighten filter blur-2xl opacity-20 animate-blob animation-delay-4000 lg:w-72 lg:h-72"></div>

      {/* Main Content Area - wider and more central for a full page feel */}
      <div className="relative z-10 w-full max-w-xl lg:max-w-3xl mx-auto py-12 sm:py-16 md:py-20">
        {/* Main Card / Interaction Block - Darker background */}
        <div className="bg-gray-800 shadow-2xl shadow-indigo-900/50 rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-8 border border-gray-700 transition-all duration-300 ease-in-out transform scale-95 md:scale-100">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              ⚡️ QuickShare Chat
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300">
              Your instant, private solution for sharing files & chats on public systems.
            </p>
          </div>

          {/* Problem Statement Section */}
          <div className="bg-gray-700/50 p-6 rounded-2xl text-left space-y-3 border border-gray-600">
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-400 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-3 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Tired of privacy risks in public places?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Logging into WhatsApp or Gmail on shared computers in college labs, libraries, or print shops exposes your personal data. QuickShare Chat is built to solve this.
            </p>
          </div>

          {/* Solution & Features Section */}
          <div className="bg-gray-700/50 p-6 rounded-2xl text-left space-y-3 border border-gray-600">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-3 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.872 5.766 4.584 7.29a12.001 12.001 0 0013.416 0c2.712-1.525 4.584-4.218 4.584-7.29a12.001 12.001 0 00-3.082-8.056z"
                />
              </svg>
              Our Privacy-First Solution:
            </h2>
            <ul className="text-gray-300 text-sm sm:text-base space-y-2 list-inside list-disc pl-4">
              <li>
                Instant Private Rooms: Create unique chat rooms in seconds.
              </li>
              <li>
                Zero Login: No accounts, no personal data stored. Ever.
              </li>
              <li>
                Secure File Sharing: Easily share documents and images.
              </li>
              <li>
                Self-Destructing: All data vanishes when the user leaves.
              </li>
            </ul>
          </div>

          {/* Create Room Section */}
          <div className="space-y-4 pt-4"> {/* Added padding top */}
            <button
              onClick={createRoom}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 text-xl sm:text-2xl flex items-center justify-center group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 sm:h-8 sm:w-8 mr-3 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Create New Room
            </button>
            <p className="text-sm text-gray-400">
              Get a unique, temporary room ID for secure, private sharing.
            </p>
          </div>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div> {/* Darker border */}
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Join Room Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="Enter Room ID to join"
                className="flex-grow border border-gray-600 bg-gray-700 px-5 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400 text-lg sm:text-xl shadow-sm transition-all duration-200"
                aria-label="Enter Room ID"
              />
              <button
                onClick={joinRoom}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 text-lg sm:text-xl flex items-center justify-center group shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 mr-2 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101m-4.242 2.828a1 1 0 011.414 0l.707.707m1.414-.707a1 1 0 010 1.414l-.707.707"
                  />
                </svg>
                Join Room
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Have a room ID? Enter it to join an existing private session.
            </p>
          </div>
        </div>

        {/* Global Footer/Disclaimer - outside the main card, at the bottom of the page */}
        <div className="mt-12 text-center text-gray-400 text-sm sm:text-base">
          <p>
            <strong className="text-white">Privacy Notice:</strong> All messages and files are strictly{" "}
            <span className="font-semibold text-red-400">temporary</span>{" "}
            and are automatically deleted once you leave the room or rejoin. We store nothing.
          </p>
          <p className="mt-4 text-xs">
            QuickShare Chat &copy; {new Date().getFullYear()} | Built for secure, transient communication.
          </p>
        </div>
      </div>
    </div>
  );
}