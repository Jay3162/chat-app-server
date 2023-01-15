const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("http");
const http = require("http").Server(app);
const PORT = process.env.PORT || 4000;
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "https://unique-figolla-069883.netlify.app"
        // origin: "http://localhost:3000"
    }
});

app.use(cors());
let users = [];
let regUsers = [];



socketIO.on("connection", (socket) => {
    socket.on("message", msg => {
      socketIO.emit("chatResponse", msg)
    })

    socket.on("authmessage", txt => {
        socketIO.emit("authResponse", txt)
    })

    socket.on("newUser", data => {
        users.push(data)
        socketIO.emit("newUserResponse", users)
    })

    socket.on("newRegUser", data => {
        regUsers.push(data)
        console.log(data)
        socketIO.emit("newRegUserResponse", regUsers)
    })

    socket.on("disconnect", () => {
        console.log(`user disconnected - ${socket.id}`);
        regUsers = regUsers.filter((user) => socket.id !== user.socketID);
        socketIO.emit("newUserResponse", users);
        socket.disconnect();
    });
});

app.get("/api", (req, res) => {
    res.json({Hello: "server"})
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})