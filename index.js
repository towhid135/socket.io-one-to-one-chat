const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var clientMapping = {};
var userId;

app.get('/:userId', (req, res) => {
  console.log('userId: ',req.params.userId);
  userId = req.params.userId;
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // console.log('Server: socket.id',socket.id);
  // console.log('Server: Connection event initiated');
  // io.to(socket.id).emit('chat message','connected');
  socket.on('sidMapping', msgObj =>{
    console.log('Server: req.params.userId ',userId);
    clientMapping[userId] = msgObj.sid;
    console.log('client mapping: ',clientMapping);
    // console.log('client Object id: ',msgObj.objId);
    // console.log('client session id: ',msgObj.sid);
  })
  socket.on('chat message', msgObj => {
    console.log('Server: chat event initiated');
    //io.emit('chat message', msg);
    const receiver = clientMapping["42"];
    // console.log('server: receiver id: ',msgObj.receiverId);
    // console.log('server: senders message: ' , msgObj.msg)

    //we can use io.to for sending message to multiple socket id
    //io.to([receiver,clientMapping["41"]]).emit('chat message',msgObj.msg);
    io.to(receiver).emit('chat message',msgObj.msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
