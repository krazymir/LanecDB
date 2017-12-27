'use strict';

const common = require('../common')
const settings = common.settings
const channels = require('irc-channels')
const irc = require("irc-connect")

class IrcClient {
    /**
     * Encodes an ip/port into an acceptable nickname
     * @param ip The IP address of the node 
     * @param port The port on which the express server's REST API reponds
     * @returns The nickname to be used for that node or null if the ip is not valid, or the port is not present, not a number or less than 1000
     */
    encodeNick(ip, port) {
        try {
            // Some sanity checks - we want valid IPs and numeric ports bigger than 999
            if (!ip || !port || !/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(ip) || (isNaN(port = parseInt(port, 10)) || (port < 1000))) {
                return null
            }
            let tetrad = ip.split('.')
            return `_${parseInt(tetrad[0]).toString(16).padStart(2, '0')}${parseInt(tetrad[1]).toString(16).padStart(2, '0')}${parseInt(tetrad[2]).toString(16).padStart(2, '0')}${parseInt(tetrad[3]).toString(16).padStart(2, '0')}${parseInt(port).toString(16)}`
        }
        catch (err) {
            common.log.error(err.message)
            return null
        }
    }

    /**
     * Decodes a nickname to an ip/port
     * @param nick The IP address of the node 
     * @param port The port on which the express server's REST API reponds
     * @returns The IP/port combo, that has been encoded in the nickname, or null if it is an invalid encoding
     */
    static decodeNick(nick) {
        // Some sanity checks - if the nickname has a string value and it's longer than 11 chars _ + 8 chars for ip + at lease 3 for port - we want to try to evaluate it
        if (!nick || !typeof nick === 'string' || nick.length < 12) {
            return null
        }
        let ip = ''
        let port = nick.substring(9)
        try {
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
                if (i < 6) {
                    ip += '.'
                }
            }
        }
        catch (err) {
            common.log.error(err.message)
        }
        return {
            ip: ip,
            port: port
        }
    }

    /**
     * Parses nicknames in a channel
     * @param nicks The raw string of nicknames, returned upon joining a channel
     * @returns An array of nicknames in the channel 
     */

    static parseNicks(nicks) {
        let nodes = []
        try {
            nicks.split(' ').forEach(element => {
                let nickParts
                if ((nickParts = element.split('_')).length > 1) {
                    let nodeInfo
                    // If it is valid and is not this node - add it
                    if ((nodeInfo = IrcClient.decodeNick(`_${nickParts[1]}`)) && nodeInfo.ip !== common.config.externalIP && nodeInfo.port !== settings.api.port && nodes.length < 1000) {
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
            let client = irc.connect(address, { nick: nick, realname: realName }).use(irc.pong, channels).on('welcome', function (msg) {
                // Received after joining the channel, when we receive who is in
                client.on('RPL_NAMREPLY', function (data) {
                    if (data && data.params && data.params.length > 3) {
                        let nodes = IrcClient.parseNicks(data.params[3])
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