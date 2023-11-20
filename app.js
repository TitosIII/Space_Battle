import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html");
})

const server = http.Server(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Sombody has connected");
})

server.listen(port, () => {
    console.log(`Escuchando en el puerto: ${port}`);
})