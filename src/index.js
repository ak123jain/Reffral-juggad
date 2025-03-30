import {app } from "./app.js";
import http from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";


dotenv.config({
    path: "./env"
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"] // Allow GET and POST methods
    }
  });

global.io = io; // Set the io instance in the global scope

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

 
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their private room`);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});


 
import  connect  from "./db/index.js";


connect()
.then(()=>{

    const port = process.env.PORT || 5000;

    server.listen( port , () => {
        console.log(` ${port}  is listening on *:`);
    });
}).catch((error)=>{
    console.log("Error connecting to DB", error);
    process.exit(1);
});
