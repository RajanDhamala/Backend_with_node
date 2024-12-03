import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./src/database/connect.js";
import { Server } from "socket.io";
import http from "http";
import handleSocketConnection from "./src/controller/Socket.io.js";


dotenv.config();

connectDb().then(() => {
  const server = http.createServer(app); 
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
    },
  });
  handleSocketConnection(io);
  
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

})
.catch((error) => {
  console.log("Error while connecting to database", error);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("hello world");
});
