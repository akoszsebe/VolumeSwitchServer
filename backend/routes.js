"use strict"
let path = require('path'),
	validator = require('validator')
	
var sockets = [],
    arraydiff = require('array-difference')

// --- ez majd nem igy kell ---   
var request = require("request");

module.exports = (app,io) => {

	app.get('/api/mute', (req, res) => {

        var id = req.param('id')
		sendmsg(id,"MUTE")
		res.json(true);
	})
	
	app.get('/api/unmute', (req, res) => {

        var id = req.param('id')
    	sendmsg(id,"UNMUTE")
		res.json(true);
	})
	
	app.get('/api/up', (req, res) => {

        var id = req.param('id')
    	sendmsg(id,"UP")
		res.json(true);
	})
	
	app.get('/api/down', (req, res) => {

        var id = req.param('id')
    	sendmsg(id,"DOWN")
		res.json(true);
	})

    app.get('/api/shutdown', (req, res) => {

        var id = req.param('id')
    	sendmsg(id,"SHUTDOWN")
		res.json(true);
	})

	function sendmsg(id,msg) {
		console.log(id +" "+msg)
		sockets.forEach(function(s){
			if (s.user_data.id == id)
				s.emit("command",msg);
		})
	}
	
	var socketnumber = 0;
    
    io.on('connection', function(socket){
        console.log('connected');
        socketnumber++

        
        socket.on('register', function(msg){
            console.log(msg);
            msg = JSON.parse(msg)
            if (sockets.length == 0)
                {
                    console.log("null socket szam");
                    socket.user_data = msg;
                    sockets.push(socket)
                    console.log('new user',msg.id );
                }
            else 
                sockets.forEach(function(item) {
                    if (item.user_data.id.toString().trim() === msg.id.toString().trim()){
                        console.log("egal");
                        //socket.disconnect();
                    }
                    else 
                    {
                        console.log("nem egal");
                        socket.user_data = msg;
                        sockets.push(socket)
                
                        console.log('new user',msg.guid +" --- "+ msg.house_ids);
                    }
            });
            
             socket.on('disconnect',function(){
                console.log('diconnected', socketnumber);
                socket.disconnect();
            });
        });
        
        socket.on('disconnect', function () {
            socketnumber--
            socket.disconnect();
            delete sockets.pop(socket)
            console.log('diconnected', socketnumber);
        });
    });
	
}
