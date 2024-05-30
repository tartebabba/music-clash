import express from "express";
import http from "http";
import { Server as socketIo, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  },
});

const port = 4001;

type Room  = {
    players: string[];
    rematchRequests: number;
    score: {
      player1: number;
      player2: number;
    };
    game_id: number;
  }
  
  const rooms: { [key: string]: Room } = {};

io.on("connection", (socket: Socket) => {
  console.log(`${socket.id} connected`);

  socket.on("joinRoom", (user: string, room: string) => {
    if (rooms[room].players.length === 2) {
      socket.emit("roomFull");
    } else if (rooms[room].players.length === 1) {
      socket.join(room);
  
      rooms[room].players.push(user);
      socket.data.room = room;
      socket.data.user = user;
  
      console.log(`User ${user} joined room ${room}`);
      rooms[room].game_id = Math.floor(Math.random() * 10) + 1;
      io.emit("roomReady", { gameID: rooms[room].game_id, players: rooms[room].players });
      io.emit("availableRooms", { rooms });
    }
  });

  socket.on("leaveRoom", (user: string, room: string) => {
    socket.leave(room);
    rooms[room].players = rooms[room].players.filter(player => player !== user)
    rooms[room].score = {
      player1: 0,
      player2: 0,
    };
    if (rooms[room].players.length === 0) {
      delete rooms[room];
    }
    console.log(`User ${user} left room`);
    io.to(room).emit("opponentDisconnected");
    io.emit("availableRooms", { rooms });
  });

  socket.on("createRoom", (user: string, room: string) => {
    if (room !== "") {
      socket.join(room);
      console.log(`${user} created and joined room: ${room}`);
      rooms[room] = {
        players: [user],
        rematchRequests: 0,
        score: { player1: 0, player2: 0 },
        game_id: 0,
      };
    }
    socket.data.room = room;
    socket.data.user = user;
    io.emit("availableRooms", { rooms });
  });

  socket.on("getAvailableRooms", () => {
    socket.emit("availableRooms", { rooms });
  });

  socket.on("groupFound", ( room: string, user: string, group: string ) => {
    socket.broadcast.to(room).emit("groupFound", { user, group });
  });

  socket.on("incorrectGuess", ( room: string, user: string, group: string ) => {
    socket.broadcast.to(room).emit("incorrectGuess", { user, group });
  });

  socket.on("gameOver", ( user: string, room: string, lives: number ) => {
    if (rooms[room].players[0] === user) {
      const increment1 = lives === 0 ? 0 : 1;
      const increment2 = lives === 0 ? 1 : 0;
      rooms[room].score = {
        player1: rooms[room].score.player1 + increment1,
        player2: rooms[room].score.player2 + increment2,
      };
    } else {
      const increment1 = lives === 0 ? 0 : 1;
      const increment2 = lives === 0 ? 1 : 0;
      rooms[room].score = {
        player1: rooms[room].score.player1 + increment2,
        player2: rooms[room].score.player2 + increment1,
      };
    }
    const scores = {
      player1: rooms[room].score.player1,
      player2: rooms[room].score.player2,
    };
    io.emit("checkScores", scores);
  });

  socket.on("rematchRequest", ( room: string ) => {
      if (rooms[room]) {
      rooms[room].rematchRequests += 1;
      socket.broadcast.to(room).emit("rematchRequest");
      checkRematchStatus(room);
    }
  });

  socket.on("confirmRematch", ( room: string ) => {
    if (rooms[room]) {
        let game_id = Math.floor(Math.random() * 10) + 1
        io.to(room).emit("confirmRematch", { gameID: game_id });
      resetRoomState(room);
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    const room = socket.data.room;
    const user = socket.data.user;
    if (room && rooms[room]) {
        rooms[room].players = rooms[room].players.filter(player => player !== user)
        rooms[room].score = {
          player1: 0,
          player2: 0,
        };
      if (rooms[room].players.length === 0) {
        delete rooms[room];
      }
      console.log(
        `User ${user} removed from room ${room} due to disconnection`
      );
      io.to(room).emit("opponentDisconnected");
      io.emit("availableRooms", { rooms });
    }
  });

  function checkRematchStatus(room: string) {
    if (rooms[room] && rooms[room].rematchRequests === 2) {
      io.to(room).emit("confirmRematch");
      resetRoomState(room);
    }
  }

  function resetRoomState(room: string) {
    if (rooms[room]) {
      rooms[room].rematchRequests = 0;
    }
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
