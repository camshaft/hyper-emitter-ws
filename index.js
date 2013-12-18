/**
 * Module dependencies
 */

module.exports = function(opts) {
  if (typeof opts === 'string') opts = {url: opts};

  var sock = new SockJS(opts.url, undefined, opts);
  var urls = {};

  function send(url, add) {
    sock.send((add ? '+' : '-') + url);
  }

  // TODO handle pre/reconnection logic

  return function(emitter) {
    emitter.on('watch', function(url) {
      urls[url] = true;
      send(url, true);
    });

    emitter.on('unwatch', function(url) {
      delete[url];
      send(url, false);
    });
  };
};
