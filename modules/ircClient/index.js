'use strict';

const common = require('../common')
const settings = common.settings
const utils = common.utils
const channels = require('irc-channels')
const irc = require("irc-connect")

class IrcClient {
    /**
     * Parses nicknames in a channel
     * @param nicks The raw string of nicknames, returned upon joining a channel
     * @returns An array of nicknames in the channel 
     */
    parseNicks(nicks) {
        let nodes = []
        try {
            nicks.split(' ').forEach(element => {
                let nickParts
                if ((nickParts = element.split('_')).length > 1) {
                    let nodeInfo
                    // If it is valid and is not this node - add it
                    if ((nodeInfo = utils.decodeNick(`_${nickParts[1]}`)) && nodeInfo.ip !== common.config.externalIP && nodeInfo.port !== settings.api.port && nodes.length < 1000) {
                        nodes.push(nodeInfo)
                    }
                }
            })
        }
        catch (err) {
            common.log.error(err.message)
        }
        return nodes
    }

    /**
     * Connects to irc and tries to find some initial bootstrap nodes to start discovery
     * @param address The address of the IRC server to connect to
     * @param nick The nickname to use
     * @param realName The real name to use
     * @param channel The channel to join
     * @param eventName The event to be fired, when the nodes are discovered
     */
    bootstrapNodes(address, nick, realName, channel, eventName) {
        try {
            let handleNicks = this.parseNicks
            let client = irc.connect(address, { nick: nick, realname: realName }).use(irc.pong, channels).on('welcome', function (msg) {
                // Received after joining the channel, when we receive who is in
                client.on('RPL_NAMREPLY', function (data) {
                    if (data && data.params && data.params.length > 3) {
                        let nodes = handleNicks(data.params[3])
                        common.emitter.emit(eventName, nodes)
                    }
                })
                this.join(channel, function (chn, names, data) {
                })
            })
        }
        catch (err) {
            common.log.error(err.message)
        }
    }
}

module.exports = new IrcClient()