var Command = function(id) {

    var handler = function() {};
    var description = "";

    var command = {
        'id': id,
        'handler': function(h) { if (h) { handler = h; return command; } else return handler; },
        'desc': function(d) { if (d) { description = d; return command; } else return description; },
        // internal cleanup
        'finalize': function() {
            command.handler = handler;
            command.desc = description;
            command.finalize = null;
            return command;
        }
    };

    return command;
};

var UpTime = function(currentTimeFunc) {

    currentTimeFunc = currentTimeFunc || Date.now;
    var startTime = currentTimeFunc();

    return Command('uptime')
        .desc("the server age")
        .handler(function(response) { 
            response.sendMessage(currentTimeFunc() - startTime); 
        });

};

var getCommands = function() {

    var commandList = null;

    var ping = Command('ping')
        .desc('is answered with a pong.')
        .handler(function(response) { 
            response.sendMessage('pong');
        });

    var uptime = UpTime();

    var message = Command('message')
        .desc("broadcast a message")
        .handler(function(response, arg) {
            response.broadcastMessage('someone: ' + arg);
            response.sendMessage('you: ' + arg);
        });

    var help = Command('help')
        .desc('print this help text')
        .handler(function(response) {
            var strings = ['Commands:'].concat(commandList.map(function(c) { 
                return c.id + " -- " + c.desc;                
            }));
            response.sendMessage(strings);
        });

    commandList = [ping, uptime, message, help];

    // End of command declaration

    var commands = {};
    commandList.forEach(function(c) { commands[c.id] = c.finalize(); });

    return commands;

};

if (typeof module !== 'undefined') {
    module.exports = {
        'get': getCommands
    };
}