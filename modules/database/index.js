'use strict';
/**
 * Initializing everything separately from the common.js,
 * so we won't get corcular references,
 * since common.js is depending on the db as well
*/
const fs = require('fs')
const sha256 = require("crypto-js/sha256")
const settings = require('../../settings.json')

const winston = require('winston')
winston.loggers.add(settings.logging.loggerName, settings.logging.loggerConfig)
const logger = winston.loggers.get(settings.logging.loggerName)

class Database {
    constructor(clusterName) {
        if (!clusterName) {
            throw new Error('You must provide a cluster name')
        }
        this.clusterName = clusterName
        this.filesPath = `${__dirname}/data/${this.clusterName}`
        // Create the path if it doesn't exist
        if (!fs.existsSync(`${__dirname}/data`)) {
            fs.mkdirSync(`${__dirname}/data`)
        }
        if (!fs.existsSync(`${__dirname}/data/${this.clusterName}`)) {
            fs.mkdirSync(`${__dirname}/data/${this.clusterName}`)
        }
    }

    /**
     * Sets a value in the DB
     * @param key the key for the value 
     * @param value The value itself
     * @returns A promise object, so you can chain logic what happens on resolving or rejecting the promise
     */
    set(key, value) {
        return new Promise((resolve, reject) => {
            fs.writeFile(`${this.filesPath}/${sha256(key)}.json`, JSON.stringify(value), (err, data) => {
                if (err) {
                    logger.error(err)
                    reject(err)
                }
                else {
                    resolve()
                }
            })
        })
    }

    /**
     * Gets a value by a key from the DB
     * @param key the key for the value
     * @returns A promise object, so you can chain logic what happens on resolving or rejecting the promise
     */
    get(key) {
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.filesPath}/${sha256(key).toString()}.json`, (err, data) => {
                if (err) {
                    logger.error(err)
                    reject(err)
                }
                else {
                    resolve(JSON.parse(data))
                }
            })
        })
    }

    /**
     * Deletes a value by a key from the DB
     * @param key The key we want to delete
     * @returns A promise object, so you can chain logic what happens on resolving or rejecting the promise
     */
    delete(key) {
        return new Promise((resolve, reject) => {
            fs.unlink(`${this.filesPath}/${sha256(key).toString()}.json`, (err, data) => {
                if (err) {
                    if (!err.code || err.code !== 'ENOENT') {
                        logger.error(err)
                        reject(err)
                    } else {
                        // The value was not found, and we're fine with that
                        resolve()
                    }
                }
                else {
                    resolve()
                }
            })
        })
    }
}

module.exports = function (clusterName) {
    return new Database(clusterName)
}