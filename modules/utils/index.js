'use strict';

const sha256 = require("crypto-js/sha256")
const sha1 = require("crypto-js/sha1")
const JSEncrypt = require('node-jsencrypt')
const jsEncrypt = new JSEncrypt()

class Utils {
    /**
     * Gets a  SHA1 hash for a given value
     * @param value The value to be hashed
     * @returns The SHA1 hash of the value
     */
    sha1(value) {
        try {
            return sha1(value)
        }
        catch (err) {
            common.log.error(err.message)
            return null
        }
    }

    /**
     * Gets a  SHA256 hash for a given value
     * @param value The value to be hashed
     * @returns The SHA256 hash of the value
     */
    sha256(value) {
        try {
            return sha256(value)
        }
        catch (err) {
            common.log.error(err.message)
            return null
        }
    }

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
    decodeNick(nick) {
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
     * Returns a random number between min (inclusive) and max (exclusive)
     * @param min The lower limit of the random number (inclusive)
     * @param max The upper limit of the random number (exclusive)
     * @returns A whole random number
     */
    getRandomRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * Encrypts data, using the auto-generated public key
     * @param data The data to be encrypted
     * @returns The encrypted data
     */
    encrypt(data) {
        return jsEncrypt.encrypt(data)
    }

    /**
     * Decrypts data, using the auto-generated or set private key
     * @param data The data to be decrypted
     * @param privateKey Optional - the private key to use, decrypting the data
     * @returns The decrypted data
     */
    decrypt(data, privateKey) {
        return jsEncrypt.decrypt(data, privateKey)
    }
}

module.exports = new Utils()