"use strict"
let express = require('express'),
	bodyParser = require('body-parser'),
 	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server)



app.set('port', process.env.PORT || 8080)

app.use(express.static(__dirname + ''))

app.use(bodyParser());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


server.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})

require('./backend/routes')(app,io)