'use strict'

const common = require('../common')
const settings = common.settings
const ircC = require('../ircClient')

function getIrcNodes(serverAddress, port, nick, realName, channel, say) {
    ircC.talk(serverAddress, nick, realName, channel, say)
}

common.emitter.once('ipDiscovered', () => {
    let nick = ircC.encodeNick(common.config.externalIP, settings.api.port)
    
    settings.irc.servers.forEach(server => {
        ircC.bootstrapNodes(server.address, nick, 'LanecDB Node', `#LanecDB@${settings.nodes.clusterName}`, 'nodeDiscovered')
    });
})