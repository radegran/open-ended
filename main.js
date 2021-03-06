var nodeFs = require('fs');
var nodeHttp = require('http');
var nodeSocketIo = require('socket.io');

var mongojs = require('mongojs');

var httpServer = require('./server/httpserver');
var socketServer = require('./server/socketserver');
var commands = require('./common/commands')
var database = require('./server/database');

var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Create

socketServer.SocketServer({
    'socket': socketServer.createSocket(
        nodeSocketIo,
        httpServer.HttpServer(
            nodeHttp, 
            nodeFs, 
            ipaddr, 
            port
        )
    ),
    'commands': commands.get(
        database.DataBase(
            mongojs
        )
    )
});

console.log("Server started at " + new Date());
