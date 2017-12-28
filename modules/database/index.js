'use strict';

const fs = require('fs')
const sha256 = require("crypto-js/sha256")

class Database {
    constructor(clusterName) {
        if (!clusterName) {
            throw new Error('You must provide a cluster name')
        }
        this.clusterName = clusterName
        this.filesPath = `${__dirname}/data/${this.clusterName}`
        // Create the path if it doesn't exist
        try {
            fs.mkdirSync(`${__dirname}/data`)
        }
        catch (err) { }
        try {
            fs.mkdirSync(`${__dirname}/data/${this.clusterName}`)
        }
        catch (err) { }
    }

    /**
     * Sets a value in the DB
     * @param key the key for the value 
     * @param value The value itself
     * @param cb A callback to be invoked, when the save is done
     */
    set(key, value, cb) {
        fs.writeFile(`${this.filesPath}/${sha256(key)}.json`, JSON.stringify(value), cb)
    }

    /**
     * Sets a value in the DB synchronously
     * @param key the key for the value 
     * @param value The value itself
     */
    setSync(key, value) {
        fs.writeFileSync(`${this.filesPath}/${sha256(key)}.json`, JSON.stringify(value))
    }

    /**
     * Gets a value by a key from the DB
     * @param key the key for the value 
     * @param cb A callback to be invoked, when the retrieval is done
     */
    get(key, cb) {
        fs.readFile(`${this.filesPath}/${sha256(key).toString()}.json`, cb)
    }

    /**
     * Gets a value from the DB synchronously
     * @param key The key we are looking to retrieve data for
     * @returns The value retrieved, or null if it is not found
     */
    getSync(key) {
        if (!fs.existsSync(`${this.filesPath}/${sha256(key).toString()}.json`)) {
            return null
        }
        return JSON.parse(fs.readFileSync(`${this.filesPath}/${sha256(key).toString()}.json`))
    }

    /**
     * Deletes a value by a key from the DB
     * @param key The key we want to delete 
     * @param cb A callback to be invoked, when the deletion is done
     */
    delete(key, cb) {
        fs.unlink(`${this.filesPath}/${sha256(key).toString()}.json`, cb)
    }

    /**
     * Deletes a value from the DB synchronously
     * @param key The key we want to delete
     * @returns True if successful, false, otherwise
     */
    deleteSync(key) {
        if (!fs.existsSync(`${this.filesPath}/${sha256(key).toString()}.json`)) {
            return false
        }
        try {
            fs.unlinkSync(`${this.filesPath}/${sha256(key).toString()}.json`)
        }
        catch (err) {
            return false
        }
        return true
    }
}

module.exports = function (clusterName) {
    return new Database(clusterName)
}