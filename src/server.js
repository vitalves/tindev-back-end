const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/* SOCKET.OI */
const connectedUsers = {}; // '1a51s515s15s5s15s': 'id_do_socket',

io.on('connection', socket => {
  // console.log('Nova conexão', socket.id);
  const { user } = socket.handshake.query;
  // console.log(user, socket.id);

  connectedUsers[user] = socket.id;

  /* TESTE SOCKET.IO
  socket.on('tipo', message => {
    console.log(message)
  });
  setTimeout(() => {
    socket.emit('world', {
      message: 'Omnistack',
    })
  }, 5000)
  */

});
/* SOCKET.OI */

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-plmcj.mongodb.net/omnistack8?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

/* socket.io */
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});
/* socket.io */

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
