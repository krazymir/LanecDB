'use strict'

const sha256 = require("crypto-js/sha256")
const sha1 = require("crypto-js/sha1")
const JSEncrypt = require('node-jsencrypt')
const settings = require('../../settings.json')
// DQ checks for the keysize value
let keysize = ((!settings.crypto || !settings.crypto.defaultKeySize || isNaN(settings.crypto.defaultKeySize)) ? 2048 : settings.crypto.defaultKeySize)
const jsEncrypt = new JSEncrypt({ default_key_size: keysize })
const fs = require('fs')

let publicKey
let privateKey

const initAsymKeysSync = (path, getKey) => {
    if (!fs.existsSync(path)) {
        let key = getKey()
        fs.writeFileSync(path, key)
        return key
    }
    else {
        return fs.readFileSync(path, 'utf8')
    }
}

/* 
* Sync asymmetric key initialization
* We want only one set of keys to be used for the node
* If one of the files is missing we are regenerating both files
*/
const removeKeyFiles = () => {
    if (fs.existsSync(`${__dirname}/../../priv.key`)) {
        fs.unlinkSync(`${__dirname}/../../priv.key`)
    }
    if (fs.existsSync(`${__dirname}/../../pub.key`)) {
        fs.unlinkSync(`${__dirname}/../../pub.key`)
    }
}
if ((fs.existsSync(`${__dirname}/../../priv.key`) && !fs.existsSync(`${__dirname}/../../pub.key`)) || (!fs.existsSync(`${__dirname}/../../priv.key`) && fs.existsSync(`${__dirname}/../../pub.key`))) {
    removeKeyFiles()
}
const initKeys = () => {
    privateKey = initAsymKeysSync(`${__dirname}/../../priv.key`, () => { return jsEncrypt.getPrivateKey() })
    publicKey = initAsymKeysSync(`${__dirname}/../../pub.key`, () => { return jsEncrypt.getPublicKey() })
}

initKeys()

class Security {
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
     * Gets the public key for the node
     * @returns The public key, used by the node
     */
    getPublicKey() {
        return publicKey
    }
    /**
     * Encrypts data, using the auto-generated public key
     * @param data The data to be encrypted
     * @param key Optional - the key to use, encrypting the data - we use the public key for encryption and private key for signing
     * @returns The encrypted data
     */
    encrypt(data, key = publicKey) {
        try {
            let jsEnc = new JSEncrypt({ default_key_size: keysize })
            jsEnc.setPublicKey(publicKey)
            return jsEnc.encrypt(data, key)
        }
        catch (err) {
            common.log.error(err.message)
            return null
        }
    }
    /**
     * Decrypts data, using the auto-generated or set private key
     * @param data The data to be decrypted
     * @param key Optional - the key to use, decrypting the data - the private key when decrypting and the public key, when verifying a signature
     * @returns The decrypted data
     */
    decrypt(data, key = privateKey) {
        try {
            let jsEnc = new JSEncrypt({ default_key_size: keysize })
            jsEnc.setPrivateKey(privateKey)
            return jsEnc.decrypt(data, key)
        }
        catch (err) {
            common.log.error(err.message)
            return null
        }
    }
    /**
     * Generates a digital signature of the data
     * @param data The data to be signed
     * @param key Optional - the private key to be used - if omitted, the default private key for the node will be used
     * @returns The signature of the data - when decrypted with the public key will return the sha256 hash of the data, proving that the holder of the private key sends this data
     */
    sign(data, key = privateKey) {
        try {
            let dataHash = sha256(JSON.stringify(data)).toString()
            return jsEncrypt.encrypt(dataHash, key)
        }
        catch (err) {
            common.log.error(err.message)
            return null
        }
    }
    /**
     * Checks the validity of the signed data - if the public key of the sender decrypts the signature and it matches the sha256 hash of the data, then it is not changed and we can verify the sender's identity
     * @param stringData The string data, which signature we must verify
     * @param signature The cryptographic signature of the data we want to verify
     * @param key Optional - the public key to be used - if omitted, the default public key for the node will be used
     * @returns true if the signature is verified and false otherwise
     */
    verifySignatureString(stringData, signature, key = publicKey) {
        try {
            let dataHash = sha256(stringData).toString()
            let sigHash = jsEncrypt.decrypt(signature, key)
            return (dataHash === sigHash)
        }
        catch (err) {
            common.log.error(err.message)
            return false
        }
    }
    /**
     * Checks the validity of the signed data - if the public key of the sender decrypts the signature and it matches the sha256 hash of the data, then it is not changed and we can verify the sender's identity
     * @param jsonData The data, which signature we must verify
     * @param signature The cryptographic signature of the data we want to verify
     * @param key Optional - the public key to be used - if omitted, the default public key for the node will be used
     * @returns true if the signature is verified and false otherwise
     */
    verifySignature(jsonData, signature, key = publicKey) {
        return this.verifySignatureString(JSON.stringify(jsonData), signature, key)
    }
    /**
     * Verifies that a request is originating from the appropriate source, before allowing it to change data
     * @param req The web request
     * @param res The web response
     * @returns true if the request is verified and false otherwise
     */
    authorizeRequest(req, res) {
        if (!req.get('pub') || !req.get('sig') || !req.body) {
            res.status(400).send('Bad Request').end()
            // Returning insread of throwing an error, because it's more efficient, in case of an ongoing DOS attack
            return false
        }
        try {
            let publicKey = req.get('pub')
            let signature = req.get('sig')
            let data = req.body.toString()
            if (!verifySignatureString(data, signature, publicKey)) {
                res.status(401).send('Unauthorized').end()
                return false
            }
        }
        catch (err) {
            res.status(401).send('Unauthorized').end()
            return false
        }
        res.status(200).end()
        return true
    }
}

module.exports = new Security()