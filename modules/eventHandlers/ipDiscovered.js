'use strict'

const common = require('../common')
const settings = common.settings
const ircClient = require('../ircClient')


function getIrcNodes(serverAddress, port, nick, realName, channel, say) {
    ircClient.talk(serverAddress, nick, realName, channel, say)
}

common.emitter.on('ipDiscovered', () => {
    let say = `${common.config.externalIP.replace(/[.]/g, '_')}&${settings.api.port}`
    let nick = 'guest' + Math.floor(Math.random()*999999)
    settings.irc.servers.forEach(server => {
        getIrcNodes(server.address, server.port, nick, 'LanecDB Node', `#LanecDB@${settings.nodes.clusterName}`, say)
    });
})