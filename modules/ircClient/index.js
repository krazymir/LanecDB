'use strict';

const common = require('../common')
const channels = require('irc-channels')
const irc = require("irc-connect")

function encodeNick(ip, port) {
    // Some sanity checks - we want valid IPs and numeric ports bigger than 999
    if (!ip || !port || !/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(ip) || (isNaN(port = parseInt(port, 10)) || (port < 1000))) {
        return null
    }
    let tetrad = ip.split('.')
    return `_${parseInt(tetrad[0]).toString(16).padStart(2, '0')}${parseInt(tetrad[1]).toString(16).padStart(2, '0')}${parseInt(tetrad[2]).toString(16).padStart(2, '0')}${parseInt(tetrad[3]).toString(16).padStart(2, '0')}${parseInt(port).toString(16)}`
}

function decodeNick(nick) {
    // Some sanity checks - if the nickname has a string value and it's longer than 11 chars _ + 8 chars for ip + at lease 3 for port - we want to try to evaluate it
    if (!nick || !typeof nick === 'string' || nick.length < 12) {
        return null
    }
    let ip = ''
    let port = nick.substring(9)
    if (isNaN(port = parseInt(port, 16))) {
        return null
    }
    for (let i = 0; i < 8; i += 2) {
        let part = nick.substring(1 + i, 3 + i)
        part = parseInt(part, 16)
        if (isNaN(part)) {
            return null
        }
        ip += part.toString()
        if(i < 6) {
            ip += '.'
        }
    }
    return {
        ip: ip,
        port: port
    }
}

function talk(address, nick, realName, channel, say) {
    let client = irc.connect(address, { nick: nick, realname: realName }).use(irc.pong, channels).on('welcome', function (msg) {
        this.join(channel, function (chn) {
            chn.msg(say)
        })
    })
}

function listen(address, nick, realName, channel, eventName) {
    irc.connect(address, { nick: nick, realname: realName }).use(irc.pong, channels).on('welcome', function (msg) {
        this.join(channel, function (chn) {
            chn.on('PRIVMSG', function (event) {
                common.emitter.emit(eventName, event)
            })
        })
    })
}

module.exports = {
    talk: talk,
    listen: listen,
    encodeNick: encodeNick,
    decodeNick: decodeNick
}