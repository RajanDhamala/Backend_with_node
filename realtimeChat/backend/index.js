import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./src/database/connect.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDb()
  .then(() => {
    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        socket.broadcast.emit("receiveMessage", data);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to database", error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});
