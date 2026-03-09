const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => res.json({ msg: 'Chat Server is alive!', status: 'OK', port: 7000 }));

// Fix for MongoDB resolution issues
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected for Chat"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error (Chat Server):", err);
        process.exit(1); // Exit if DB connection fails
    });

// Chat Schema & Model
const chatSchema = new mongoose.Schema(
    {
        roomId: { type: String, required: true },
        senderEmail: { type: String, required: true },
        receiverEmail: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }, // ✅ Ensure timestamp is saved properly
    },
    { timestamps: true }
);
const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Presence Tracking
const onlineUsers = new Map(); // email -> Set of socket.ids

const broadcastOnlineUsers = () => {
    const emails = Array.from(onlineUsers.keys());
    io.emit("online_users", emails);
    console.log(`📡 Broadcasted online users: ${emails.length}`);
};

io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    // Identify user and mark as online
    socket.on("user_online", (email) => {
        if (!email) return;
        const normalizedEmail = email.toLowerCase().trim();

        if (!onlineUsers.has(normalizedEmail)) {
            onlineUsers.set(normalizedEmail, new Set());
        }
        onlineUsers.get(normalizedEmail).add(socket.id);

        console.log(`🟢 User ${normalizedEmail} is online (Socket: ${socket.id})`);
        broadcastOnlineUsers();
    });

    // Join chat room
    socket.on("join_chat", async ({ senderEmail: sEmail, receiverEmail: rEmail }) => {
        const senderEmail = sEmail?.toLowerCase().trim();
        const receiverEmail = rEmail?.toLowerCase().trim();

        console.log(`📩 join_chat request from ${senderEmail} to ${receiverEmail}`);
        if (!senderEmail || !receiverEmail) {
            console.log("⚠️ Missing emails in join_chat");
            return;
        }

        const roomId = [senderEmail, receiverEmail].sort().join("_");
        socket.join(roomId);
        console.log(`🔹 User ${socket.id} joined chat room: ${roomId}`);

        try {
            const messages = await Chat.find({ roomId }).sort({ timestamp: 1 });
            console.log(`📜 Loaded ${messages.length} messages for room ${roomId}`);
            socket.emit("load_messages", messages);
        } catch (err) {
            console.error("❌ Error loading messages:", err);
        }
    });

    // Handle message sending
    socket.on("send_message", async ({ senderEmail: sEmail, receiverEmail: rEmail, message }) => {
        const senderEmail = sEmail?.toLowerCase().trim();
        const receiverEmail = rEmail?.toLowerCase().trim();

        console.log(`✉️ send_message from ${senderEmail} to ${receiverEmail}`);
        if (!senderEmail || !receiverEmail || !message) {
            console.log("⚠️ Missing fields in send_message");
            return;
        }

        try {
            const roomId = [senderEmail, receiverEmail].sort().join("_");

            const newMessage = new Chat({
                senderEmail,
                receiverEmail,
                message,
                roomId,
                timestamp: new Date(),
            });

            await newMessage.save();
            console.log(`💾 Message saved to DB: "${message.substring(0, 20)}..."`);

            io.to(roomId).emit("receive_message", newMessage);
            console.log(`📤 Broadcasted message to room: ${roomId}`);
        } catch (err) {
            console.error("❌ Error sending message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log(`🔻 User Disconnected: ${socket.id}`);

        // Remove socket from presence tracker
        onlineUsers.forEach((sockets, email) => {
            if (sockets.has(socket.id)) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    onlineUsers.delete(email);
                    console.log(`🔴 User ${email} went offline`);
                }
            }
        });

        broadcastOnlineUsers();
    });
});

// Endpoint to get list of unique users a person has chatted with
app.get("/chats/:email", async (req, res) => {
    const email = req.params.email?.toLowerCase().trim();
    if (!email) return res.status(400).json({ message: "Email required" });

    try {
        console.log(`🔍 Fetching chats for: ${email}`);
        // Find all chats where the user is either sender or receiver (case-insensitive)
        const chats = await Chat.find({
            $or: [
                { senderEmail: { $regex: new RegExp("^" + email + "$", "i") } },
                { receiverEmail: { $regex: new RegExp("^" + email + "$", "i") } }
            ]
        }).sort({ timestamp: -1 });

        console.log(`✅ Found ${chats.length} messages for ${email}`);

        // Extract unique chat partners and their latest message
        const chatMap = new Map();
        chats.forEach(chat => {
            // Compare lowercased emails to find the partner
            const s = chat.senderEmail.toLowerCase();
            const r = chat.receiverEmail.toLowerCase();
            const partnerEmail = s === email ? chat.receiverEmail : chat.senderEmail;

            const standardizedPartner = partnerEmail.toLowerCase();
            if (!chatMap.has(standardizedPartner)) {
                chatMap.set(standardizedPartner, {
                    partnerEmail: partnerEmail, // Keep original casing for display
                    latestMessage: chat.message,
                    timestamp: chat.timestamp,
                    roomId: chat.roomId
                });
            }
        });

        res.status(200).json(Array.from(chatMap.values()));
    } catch (err) {
        console.error("❌ Error fetching chat list:", err);
        res.status(500).json({ message: "Error fetching chat list" });
    }
});

// Start Server
const PORT = 7000;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
    console.log(`\n🚀 CHAT SERVER IS RUNNING`);
    console.log(`📡 Local:            http://localhost:${PORT}`);
    console.log(`🌐 Network (Any WiFi): Access via your Computer's IP on port ${PORT}`);
});
