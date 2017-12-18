const common = require('../common')
const settings = common.settings

const ircClient = require('../ircClient')

module.exports = {
    run: (args) => {
        settings.irc.servers.forEach(server => {
            let nick = 'guest' + Math.floor(Math.random() * 999999)
            ircClient.listen(server.address, nick, 'LanecDB Node', `#LanecDB@${settings.nodes.clusterName}`, 'nodeDiscovered')
        })
    }
}