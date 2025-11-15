import express from "express";
import http from "http";
import WebSocket from "ws";
import { setupWSConnection } from "y-websocket/bin/utils.js";
import { Server as IOServer } from "socket.io";

const app = express();

// Serve static web client from /public
app.use(express.static("public"));

// simple health check
app.get('/health', (req, res) => res.json({ok: true}));

const server = http.createServer(app);

// Socket.io for signaling
const io = new IOServer(server, {
  cors: { origin: "*" },
  path: "/socket.io"
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { id: socket.id });
  });

  socket.on("signal", (data) => {
    // data: { to, signal }
    io.to(data.to).emit("signal", { from: socket.id, signal: data.signal });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

// Y-WebSocket server for collaborative editing at /yjs
const wss = new WebSocket.Server({ server, path: "/yjs" });
wss.on("connection", (conn, req) => {
  // uses y-websocket's setupWSConnection
  try {
    setupWSConnection(conn, req);
  } catch (e) {
    console.error("Y-WebSocket setup error", e);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
