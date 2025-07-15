"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { connectSocket, getSocket } from "@/lib/socket"; // Assuming '@/lib/socket' exists
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function RoomPage() {
    type ChatMessage = {
        sender: string;
        message: string;
        type: 'text' | 'file';
        originalName?: string; // <-- Add this optional field
    };

    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const { roomId } = useParams();
    const [messageInput, setMessageInput] = useState("");
    const [name, setName] = useState("");
    const [hasName, setHasName] = useState(false);
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling chat
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For responsive sidebar

    // Scroll to bottom of messages whenever they change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!roomId || typeof roomId !== "string" || !hasName) return;

        const socket = connectSocket();

        const handleConnect = () => {
            socket.emit("join-room", { roomId, name });
        };

        if (socket.connected) {
            handleConnect();
        } else {
            socket.on("connect", handleConnect);
        }

        socket.on("room-users", (userList) => {
            setUsers(userList);
        });

        socket.on("receive-message", (data: { sender: string; message: string; type: 'text' | 'file' }) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("user-disconnected", (disconnectedUser) => {
            setMessages((prev) => [
                ...prev,
                { sender: "System", message: `${disconnectedUser.name} has left the room.`, type: 'text' },
            ]);
        });

        socket.on("connect-success", (data) => {
            setMessages((prev) => [
                ...prev,
                { sender: "System", message: `Welcome to Room ${data.roomId}!`, type: 'text' },
            ]);
        });

        socket.on("user-joined", (joinedUser) => {
            setMessages((prev) => [
                ...prev,
                { sender: "System", message: `${joinedUser.name} has joined the room.`, type: 'text' },
            ]);
        });


        return () => {
            socket.disconnect();
        };
    }, [roomId, hasName, name]);

    const sendMessage = () => {
        const socket = getSocket();
        if (socket && messageInput.trim()) {
            socket.emit("send-message", { roomId, message: messageInput, name, type: 'text' });
            setMessageInput("");
        }
    };

    const sendFile = async (file: File) => {
        if (!file || !roomId || !name) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("roomId", roomId.toString());
        formData.append("sender", name);

        try {
            const res = await fetch(" https://quickshare-backend-n6qt.onrender.com/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!data.success) throw new Error("Upload failed");
            toast.info("📎 Shared file will be auto-deleted in 3 minutes");
            // Do nothing here. The socket will receive and update UI.
        } catch (err) {
            console.error("Upload failed", err);
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            Array.from(files).forEach((file) => {
                sendFile(file);
            });
        }

        // Optional: clear input so same file can be uploaded again later
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };



    // Name input modal
    if (!hasName) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center space-y-6 max-w-sm w-full border border-gray-700">
                    <h2 className="text-3xl font-extrabold text-white">Join QuickShare Chat</h2>
                    <p className="text-gray-400">Enter your name to start chatting securely.</p>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && name.trim()) {
                                setHasName(true);
                            }
                        }}
                        placeholder="Your name"
                        className="w-full px-5 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    />
                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 text-xl"
                        onClick={() => {
                            if (name.trim()) setHasName(true);
                        }}
                    >
                        Join Chat
                    </button>
                </div>
            </div>
        );
    }

    return (

        <div className="flex min-h-[100dvh] bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans antialiased overflow-hidden">
            {/* Sidebar for users - visible on large screens, collapsible on small */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-gray-800 p-6 border-r border-gray-700 flex flex-col z-20 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Participants</h2>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <ul className="space-y-3 flex-grow overflow-y-auto custom-scrollbar pr-2">
                    {users.map((u) => (
                        <li
                            key={u.id}
                            className={`flex items-center text-lg ${u.name === name ? "text-indigo-400 font-semibold" : "text-gray-300"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3 opacity-75"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            {u.name} {u.name === name && "(You)"}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main chat content area */}
            <div className="flex-1 flex flex-col min-h-0 lg:ml-64">
                {/* Chat Header - sticky */}
                <header className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 z-10 shadow-lg shrink-0">
                    <div className="flex items-center">
                        <button
                            className="lg:hidden text-gray-400 hover:text-white mr-4"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            <span className="text-green-500 mr-2">●</span> Room: <span className="text-indigo-400">{roomId}</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base hidden sm:block">
                        {users.length} Participant(s)
                    </p>
                </header>
                <ToastContainer position="top-right" autoClose={3000} />
                {/* Messages Display Area - flex-1 to fill remaining space */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto overscroll-contain custom-scrollbar flex flex-col min-h-0">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx} // In a real app, messages from server should have unique IDs
                            // ADDED mb-2 for a small margin-bottom
                            className={`flex mb-2 ${msg.sender === name ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[70%] lg:max-w-[60%] p-3 rounded-lg shadow-md ${msg.sender === name
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-gray-700 text-gray-200 rounded-bl-none"
                                    } ${msg.sender === "System" && "bg-yellow-800/30 text-yellow-300 text-sm italic rounded-lg px-4 py-2"}`}
                            >
                                {msg.sender !== name && msg.sender !== "System" && (
                                    <p className="text-xs font-semibold mb-1 text-gray-400">
                                        {msg.sender}
                                    </p>
                                )}
                                {!(msg.type === "file" && msg.message.startsWith("http")) && (
                                    <p className="break-words">{msg.message}</p>
                                )}
                                {/* Placeholder for file display */}
                                {msg.type === "file" && (
                                    <div className="mt-2 space-y-2 max-w-full">
                                        {/* Download Button */}
                                        <a
                                            href={`${msg.message}?download=true`}
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                                        >
                                            📎 Download {msg.originalName || "file"}
                                        </a>


                                        {/* Image Preview */}
                                        {msg.message.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                            <img
                                                src={msg.message}
                                                alt="uploaded"
                                                className="max-w-full sm:max-w-xs rounded-lg border border-gray-600"
                                            />
                                        )}

                                        {/* Video Preview */}
                                        {msg.message.match(/\.(mp4|webm|ogg)$/i) && (
                                            <video
                                                controls
                                                src={msg.message}
                                                className="w-full sm:max-w-xs rounded-lg border border-gray-600"
                                            />
                                        )}

                                        {/* General Document Preview (PDF, DOCX, XLSX, etc.) */}
                                        {!msg.message.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)$/i) && (
                                            <div className="w-full max-w-full sm:max-w-md bg-gray-700 border border-gray-600 rounded-lg p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8 text-yellow-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 4v16m8-8H4"
                                                        />
                                                    </svg>
                                                    <div className="text-white text-sm break-all">
                                                        <p className="font-medium">{msg.originalName || "Shared Document"}</p>
                                                        <p className="text-gray-400 text-xs">Document File</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={msg.message}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-400 underline"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}



                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                </div>

                {/* Message Input and Send Area - sticky bottom */}
                <div className="bg-gray-800 p-3 sm:p-4 border-t border-gray-700 flex items-center shadow-lg z-30 sticky bottom-0 shrink-0 pb-[env(safe-area-inset-bottom)]">
                    <input
                        className="flex-grow bg-gray-700 text-white placeholder-gray-400 px-4 py-2 sm:px-5 sm:py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg mr-2 sm:mr-3"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        placeholder="Type your message here..."
                        aria-label="Type your message"
                    />
                    <>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Button to trigger file input */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 sm:p-3 rounded-xl transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 mr-2 sm:mr-3 shrink-0"
                            title="Attach File"
                            aria-label="Attach File"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 sm:h-6 sm:w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a3 3 0 104.243 4.243l6.586-6.586a2 2 0 10-2.828-2.828l-6.586 6.586a1 1 0 001.414 1.414l.707-.707m1.414-.707a1 1 0 011.414 0l.707.707"
                                />
                            </svg>
                        </button>
                    </>

                    <button
                        onClick={sendMessage}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 sm:p-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shrink-0"
                        aria-label="Send Message"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 sm:h-6 sm:w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 5l7 7-7 7M5 12h14"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Overlay for sidebar on small screens */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            {/* Custom Scrollbar Styling (add to global CSS or as a <style> block if not using postcss) */}
            <style jsx global>{`
        /* For Webkit browsers (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* width of the scrollbar */
          height: 8px; /* height for horizontal scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* Dark gray for track */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #6366f1; /* Indigo for thumb */
          border-radius: 10px;
          border: 2px solid #374151; /* Border around thumb */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #4f46e5; /* Darker indigo on hover */
        }

        /* Essential for preventing unwanted scroll when keyboard pops up on mobile */
        html, body, #__next {
    height: 100%;
    overflow: auto;
    overscroll-behavior: contain;
  }
      `}</style>
        </div>
    );
}