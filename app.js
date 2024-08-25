const express = require ('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

let initiatorId = null;

io.on('connection',function(socket){
    console.log(`user is connected`);
    if(!initiatorId)
    {
        initiatorId = socket.id;
        socket.emit('role','initiator');
    }
    else
    {
        socket.emit('role','responder');
    }

    socket.on('signal',function(data){
        socket.broadcast.emit('signal',data);
    })

    socket.on('disconnect',function(){
        if(socket.id === initiatorId)
        {
            initiatorId = null;
            console.log('Call initiator is disconnected');
        }
        else{

            console.log('user is disconnected');
        }
    })

})


app.get('/',function(req,res){
    res.render(`index`);
})


server.listen(3000,function(){
    console.log("server is running");
});