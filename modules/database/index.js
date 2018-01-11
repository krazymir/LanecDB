'use strict'
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
    constructor(clusterName = null, systemDatabase = false) {
        if (!clusterName && !systemDatabase) {
            throw new Error('You must provide a cluster name or designate this database as system database')
        }
        this.dbRoot = clusterName && !systemDatabase ? clusterName : 'system'
        this.filesPath = `${__dirname}/data/${this.dbRoot}`
        // Create the path if it doesn't exist
        if (!fs.existsSync(`${__dirname}/data`)) {
            fs.mkdirSync(`${__dirname}/data`)
        }
        if (!fs.existsSync(`${__dirname}/data/${this.dbRoot}`)) {
            fs.mkdirSync(`${__dirname}/data/${this.dbRoot}`)
        }
    }
    /**
     * Sets a value in the DB
     * @param key the key for the value 
     * @param value The value itself
     * @param group Optional - the group to which the key belongs to
     * @returns A promise object, so you can chain logic what happens on resolving or rejecting the promise
     */
    set(key, value, group = null) {
        return new Promise((resolve, reject) => {
            // If we have a group set, and there is no folder for it - we create it, before saving the data into the group
            if (group && !fs.existsSync(`${this.filesPath}/${sha256(group).toString()}`)) {
                fs.mkdirSync(`${this.filesPath}/${sha256(group).toString()}`)
            }
            fs.writeFile(`${this.filesPath}/${group ? sha256(group).toString() + '/' : ''}${sha256(key)}.json`, JSON.stringify(value), (err, data) => {
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
     * @param group Optional - the group to which the key belongs to
     * @returns A promise object, so you can chain logic what happens on resolving or rejecting the promise
     */
    get(key, group = null) {
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.filesPath}/${group ? sha256(group).toString() + '/' : ''}${sha256(key).toString()}.json`, (err, data) => {
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
     * @param group Optional - the group to which the key belongs to
     * @returns A promise object, so you can chain logic what happens on resolving or rejecting the promise
     */
    delete(key, group = null) {
        return new Promise((resolve, reject) => {
            fs.unlink(`${this.filesPath}/${group ? sha256(group).toString() + '/' : ''}${sha256(key).toString()}.json`, (err, data) => {
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