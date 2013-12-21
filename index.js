/**
 * Module dependencies
 */

var ws = require('engine.io');

module.exports = function(opts) {
  if (typeof opts === 'string') opts = {url: opts};

  var sock = ws(opts.url, opts);
  var urls = {};

  function send(url, add) {
    // TODO buffer subscriptions if we're not connected
    sock.send((add ? '+' : '-') + url);
  }

  sock.on('close', function() {
    sock = ws(opts.url, opts);
  });

  return function(emitter) {
    emitter.on('watch', function(url) {
      urls[url] = true;
      send(url, true);
    });

    emitter.on('unwatch', function(url) {
      delete[url];
      send(url, false);
    });

    sock.on('message', function(url) {
      emitter.refresh(url);
    });
  };
};
