const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const usernames = {};

io.on('connection', (socket) => {
  socket.on('add user', (username) => {
    usernames[socket.id] = username;
    io.emit('add user', username);
    io.emit('users', usernames);
  });
  
  
  socket.on('Typing', () => {
    socket.broadcast.emit('Typing', usernames[socket.id])
  })

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', {
      username: usernames[socket.id],
      message: msg,
    });
  });


  socket.on('disconnect', () => {
    console.log(`${usernames[socket.id]} disconnected!`);
    io.emit('user disconnected', usernames[socket.id])
    delete usernames[socket.id];
    console.log(usernames)
  });
});

server.listen(PORT, () => {
  console.log('Server listening on port 3000...');
});
