'use strict';

const common = require('../common')
const channels = require('irc-channels')
const irc = require("irc-connect")

function ipPortToNick(ip, port) {
    // Some sanity checks - we want valid IPs and numeric ports bigger than 999
    if(!ip || !port || !/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(ip) || (isNaN(parseInt(port, 10)) || (port < 1000))) {
        return null
    }
    let tetrad = ip.split('.')
    return `_${tetrad[0].toString(16).padStart(2, '0')}${tetrad[1].toString(16).padStart(2, '0')}${tetrad[2].toString(16).padStart(2, '0')}${tetrad[3].toString(16).padStart(2, '0')}${port.toString(16)}`
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
    ipPortToNick: ipPortToNick
}