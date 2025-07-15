const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const roomUsers = {}; // { roomId: [ { id, name } ] }

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Next.js frontend
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.get("/tmp/:filename", (req, res) => {
  const filePath = path.join(__dirname, "tmp", req.params.filename);

  const shouldDownload = req.query.download === "true";
  if (shouldDownload) {
    return res.download(filePath);
  } else {
    return res.sendFile(filePath);
  }
});


// Multer setup to store in ./tmp
const upload = multer({
  dest: "tmp/", // Save in /tmp folder
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max
});

// Basic health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// File upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { roomId, sender } = req.body;

  if (!file || !roomId || !sender) {
    return res.status(400).json({ error: "Missing file, roomId, or sender" });
  }

  const ext = path.extname(file.originalname); // e.g., .mp4
  const finalName = file.filename + ext;
  const finalPath = path.join(__dirname, "tmp", finalName);

  try {
    // Copy to new file with extension
    await fs.promises.copyFile(file.path, finalPath);

    // Delete the original temp file (without extension)
    await fs.promises.unlink(file.path);

    const fileUrl = `http://localhost:5000/tmp/${finalName}`;
    console.log(`📁 File uploaded by ${sender}: ${file.originalname}`);

    // Emit file message to all users in room
    io.to(roomId).emit("receive-message", {
      message: fileUrl,
      sender,
      type: "file",
      originalName: file.originalname,
    });

    // Auto-delete the file after 3 mins
    setTimeout(() => {
      fs.unlink(finalPath, (err) => {
        if (err) console.error("❌ Failed to delete:", finalPath);
        else console.log("🧹 Deleted:", finalPath);
      });
    }, 3 * 60 * 1000);

    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    console.error("❌ File handling failed:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);
    console.log(`👤 ${name} joined room ${roomId}`);

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

    roomUsers[roomId].push({ id: socket.id, name });
    io.to(roomId).emit("room-users", roomUsers[roomId]);

    // Optional: notify room that user joined
    socket.to(roomId).emit("user-joined", { id: socket.id, name });
    socket.emit("connect-success", { roomId });
  });

  socket.on("send-message", ({ roomId, message, name, type = "text" }) => {
    io.to(roomId).emit("receive-message", {
      message,
      sender: name || socket.id,
      type,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);

    for (const roomId in roomUsers) {
      const user = roomUsers[roomId].find((u) => u.id === socket.id);
      if (user) {
        roomUsers[roomId] = roomUsers[roomId].filter((u) => u.id !== socket.id);
        io.to(roomId).emit("room-users", roomUsers[roomId]);
        socket.to(roomId).emit("user-disconnected", user);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
