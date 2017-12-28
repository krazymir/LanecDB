'use strict';
const assert = require('assert')
const common = require('./../modules/common')
const utils = common.utils

describe('utils', function () {
    it('utils.getRandomRange(min, max) should return a whole number, larger than or equal to min and less than max', function () {
        let value = utils.getRandomRange(1000, 100000)
        assert(!isNaN(value) && value >= 1000 && value < 100000 && Math.floor(value) === value)
    })
    it('encodeNick(ip, port) should return null if the ip is not valid', function () {
        assert.equal(utils.encodeNick('not an ip', 1232))
    })
    it('encodeNick(ip, port) should return null if the ip is not valid', function () {
        assert.equal(utils.encodeNick('299.999.333.111', 1232))
    })
    it('encodeNick(ip, port) should return null if the port is not a number', function () {
        assert.equal(utils.encodeNick('192.168.0.1', 'not a port'))
    })
    it('encodeNick(ip, port) should return null if the port is less than 1000', function () {
        assert.equal(utils.encodeNick('192.168.0.1', -3232))
    })
    it('encodeNick(ip, port) should return null if the port is less than 1000', function () {
        assert.equal(utils.encodeNick('192.168.0.1', 973))
    })
    // Checking the encode vs decode
    it('encodeNick(ip, port), used with decodeNick(nick) should return the same ip/port', function () {
        let ip = '87.34.55.231'
        let port = 1234
        let res = utils.decodeNick(utils.encodeNick(ip, port))
        assert.equal(res.ip, ip)
        assert.equal(res.port, port)
    })
    it('encodeNick(ip, port), used with decodeNick(nick) should return the same ip/port', function () {
        let ip = '17.147.125.17'
        let port = 47383
        let res = utils.decodeNick(utils.encodeNick(ip, port))
        assert.equal(res.ip, ip)
        assert.equal(res.port, port)
    })
})