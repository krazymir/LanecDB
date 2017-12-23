'use strict'

const common = require('../common')
const settings = common.settings
const ircClient = require('../ircClient')

function getIrcNodes(serverAddress, port, nick, realName, channel, say) {
    ircClient.talk(serverAddress, nick, realName, channel, say)
}

common.emitter.on('ipDiscovered', () => {
    let nick = ircClient.ipPortToNick(common.config.externalIP, settings.api.port)
    
    settings.irc.servers.forEach(server => {
        ircClient.listen(server.address, nick, 'LanecDB Node', `#LanecDB@${settings.nodes.clusterName}`, 'nodeDiscovered')
    });
})