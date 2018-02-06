'use strict'

const common = require("../common")

class Block {
    constructor(index, previousHash, timestamp, data, previousBlock) {
        this.index = index
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.data = data
        this.previousBlock = previousBlock
        this.refreshBlockHash()
    }

    /**
     * Returns a new block instance
     * @returns The a new block
     */
    createNewBlock(index, previousHash, timestamp, data, previousBlock){
        return new Block(index, previousHash, timestamp, data, previousBlock)
    }

    /**
     * Returns the hash of the block
     * @returns The hash value of the block
     */
    calculateBlockHash(){
        return common.utils.security.sha256(this.index.toString() + this.previousHash.toString() + this.timestamp.toString() + JSON.stringify(this.data)).toString()
    }

    /**
     * Refreshes the block hash
     */
    refreshBlockHash(){
        this.hash = this.calculateBlockHash()
    }
}

module.exports = new Block(0, '', common.utils.getUTCNow(), {}, null)