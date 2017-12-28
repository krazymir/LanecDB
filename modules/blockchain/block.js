'use strict'

const common = require("../common")

class Block {
    constructor(index, previousHash, timestamp, data) {
        this.index = index
        this.previousHash = previousHash.toString()
        this.timestamp = timestamp
        this.data = data
        this.hash = common.utils.sha256(index + previousHash + timestamp + data).toString()
    }

    /**
     * Returns the genesis block for the blockchain
     * @returns The genesis block
     */
    getGenesisBlock = () => {
        return new Block(0, "0", 1465154705, "Genesis block")
    }
}

module.exports = new Block(0, "0", 1465154705, "Genesis block")