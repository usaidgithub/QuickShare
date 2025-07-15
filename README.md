# 🚀 QuickShare - Real-Time File and Chat Sharing App

QuickShare is a minimal, real-time file and chat sharing platform built using **Next.js** (React), **Node.js**, **Express**, and **Socket.io**. It allows users to join temporary chat rooms, send text messages, and share files securely — all with auto-deletion after a few minutes.

## ✨ Features

- 🔒 No login required — just enter your name to join any room
- 💬 Real-time chat via Socket.io
- 📎 Share images, videos, PDFs, and documents
- 🕒 Auto-deletes shared files after 3 minutes
- 📱 Responsive design for mobile and desktop
- 📤 File previews (image, video, PDF) and download option
- 💡 Lightweight and fast — no database or permanent storage

## ⚙️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **File Uploads:** Multer
- **Notifications:** React Toastify

---

## 📁 Folder Structure
temp-chat-frontend/ → Next.js frontend
temp-chat-backend/ → Node.js backend server with Socket.io
└── tmp/ → Temporarily stores uploaded files

---

## 🧑‍💻 How to Run Locally

### 🔧 Prerequisites

- Node.js & npm installed
- Git installed

---

### 🚀 Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/usaidgithub/QuickShare
cd temp-chat-frontend

2.Start the backend server
cd temp-chat-backend
npm install
node index.js

3. Start the Frontend App
cd ..
npm install
npm run dev

🧪 Testing the App
1.Open http://localhost:3000/room/your-room-id in two tabs or different devices.
2.Enter a name to join.
3.Start sending messages and uploading files!
4.Uploaded files will auto-delete after 3 minutes.

