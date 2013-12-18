/**
 *
 */

var stack = require('simple-stack-common');
var sockjs = require('sockjs');
var Emitter = require('events').EventEmitter;

var emitter = new Emitter();

// Expose the app

var app = module.exports = stack();

var ws = sockjs.createServer();

ws.on('connection', function(conn) {
  var fns = {};

  conn.on('data', function(message) {
    var add = message[0] === '+';
    var url = message.substring(1);
    function notify() {
      conn.write(url);
    }
    emitter.on(url, notify);
  });
});

// Add sockjs handler

app.on('ready', function(server) {
  ws.installHandlers(server, {prefix: '/ws'});
});

app.post('/', function(req, res) {
  var url = res.body.url;
  emitter.emit(url);
});
