'use strict'

const SHA256 = require("crypto-js/sha256")

class Block {
    constructor(index, previousHash, timestamp, data) {
        this.index = index
        this.previousHash = previousHash.toString()
        this.timestamp = timestamp
        this.data = data
        this.hash = SHA256(index + previousHash + timestamp + data).toString()
    }

    getGenesisBlock = () => {
        return new Block(0, "0", 1465154705, "Genesis block")
    }
}

module.exports = new Block(0, "0", 1465154705, "Genesis block")