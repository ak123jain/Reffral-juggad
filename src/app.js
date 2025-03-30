import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();

// Middleware to attach Socket.IO instance to request
app.use((req, res, next) => {
  req.io = global.io; // Access the io instance from the global scope
  next();
});

app.use(cors({
    origin:  process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

import  MentorRouter  from './routes/Mentor.router.js';
import  MessegeRouter  from './routes/messege.router.js';
import useRouter from './routes/user.router.js';

app.use("/mentor", MentorRouter)
app.use("/messege" , MessegeRouter)
app.use("/user", useRouter)

export {app}