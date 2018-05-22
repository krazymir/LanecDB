'use strict'
const block = require('./block')
const common = require('../common')

class Blockchain {
    constructor() {
        this.genesis = this.getGenesisBlock()
        this.tail = this.genesis
    }

    /**
    * Adds a new block with the specified data to the blockchain
    * @param data The data that has to be added to the new block
    */
    addNextBlockData(data) {
        let created = block.createNewBlock(this.tail.index + 1, this.tail.hash, common.utils.getUTCNow(), data, this.tail)
        this.tail = created
    }

    /**
     * Adds a new block to the blockchain
     * @param newBlock A new block to be added to the blockchain
     */
    addNextBlock(newBlock) {
        this.addNextBlockData(newBlock.data)
    }

    /**
     * Returns the genesis block for the blockchain
     * @returns The genesis block
     */
    getGenesisBlock() {
        return block.createNewBlock(0, "0", 1465154705, "Genesis block", 0, null)
    }

    /**
     * Validates the state of the blockchain
     * @returns True if the blockchain is in a valid state and false otherwise
     */
    validateBlockChain() {
        try{
            this.validateFromBlock(this.tail)
            return true
        }
        catch(ex){
            return false
        }
    }

    /**
     * Validates the state of the blockchain from a particlular block to the genesis block
     */
    validateFromBlock(currentBlock){
        if(!currentBlock){
            throw "Cannot validate the block"
        }
        if (
            (currentBlock.hash != currentBlock.calculateBlockHash())
            || (currentBlock.previousBlock && currentBlock.previousBlock.hash != currentBlock.previousHash)
        ) {
            throw "Invalid"
        }
        if(currentBlock.previousBlock){
            validateFromBlock(currentBlock.previousBlock)
        }
    }
}

module.exports = new Blockchain()