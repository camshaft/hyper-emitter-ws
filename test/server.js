/**
 * Module dependencies
 */

var stack = require('simple-stack-common');
var engine = require('engine.io');
var Emitter = require('events').EventEmitter;

var emitter = new Emitter();

// Expose the app

var app = module.exports = stack();

// Add sockjs handler

app.on('ready', function(server) {
  var ws = engine.attach(server);

  ws.on('connection', function(conn) {
    var fns = {};

    function sub(url) {
      function notify() {
        conn.write(url);
      }
      emitter.on(url, notify);
      fns[url] = notify;
    }

    function unsub(url) {
      if (!fns[url]) return;
      emitter.removeListener(url, fns[url]);
      delete fns[url];
    }

    conn.on('message', function(message) {
      console.log('MESSAGE', message);
      var add = message[0] === '+';
      var url = message.substring(1);
      add ? sub(url) : unsub(url);
    });

    conn.on('close', function() {
      Object.keys(fns).forEach(unsub);
    });
  });
});

app.post('/', function(req, res) {
  var url = req.body.url;
  emitter.emit(url);
  res.send(200);
});
