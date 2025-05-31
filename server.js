import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on('joinThread', (threadId) => {
      // TODO: Authenticate the user before joining the thread
      console.log(`User ${socket.id} joining thread ${threadId}`);
      socket.join(threadId);
    });
    socket.on('leaveThread', (threadId) => {
      socket.leave(threadId);
    });
    console.log("A user connected", socket.id);
  });

  global._io = io;

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
