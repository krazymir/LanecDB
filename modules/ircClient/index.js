'use strict';

const common = require('../common')
const channels = require('irc-channels')
const irc = require("irc-connect")

function talk(address, nick, realName, channel, say) {
    let client = irc.connect(address, { nick: nick, realname: realName }).use(irc.pong, channels).on('welcome', function (msg) {
        this.join(channel, function (chn) {
            chn.msg(say)
            chn.part()
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
    listen: listen
}