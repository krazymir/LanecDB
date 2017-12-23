var assert = require('assert');
var ircClient = require('./../modules/ircClient');

describe('ircClient', function() {
  it('ipPortToNick(ip, port) should return null if the ip is not valid', function() {
    assert.equal(ircClient.ipPortToNick('not an ip', 1232))
  })
  it('ipPortToNick(ip, port) should return null if the ip is not valid', function() {
    assert.equal(ircClient.ipPortToNick('299.999.333.111', 1232))
  })
  it('ipPortToNick(ip, port) should return null if the port is not a number', function() {
    assert.equal(ircClient.ipPortToNick('192.168.0.1', 'not a port'))
  })
  it('ipPortToNick(ip, port) should return null if the port is less than 1000', function() {
    assert.equal(ircClient.ipPortToNick('192.168.0.1', -3232))
  })
  it('ipPortToNick(ip, port) should return null if the port is less than 1000', function() {
    assert.equal(ircClient.ipPortToNick('192.168.0.1', 973))
  })
})