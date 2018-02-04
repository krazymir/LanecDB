'use strict'

class DBNode {
    constructor(ip, port, discoverDate){
        this.ip = ip
        this.port = port
        let date = new Date()
        this.discoverDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
    }
}