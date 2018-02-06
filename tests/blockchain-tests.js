'use strict';

const assert = require('assert')
let blockchain
describe('Blockchain tests', function () {
    it('Should create a blockchain instance', function () {
        assert.doesNotThrow(function () {
            blockchain = require('../modules/blockchain')
        })
    })
    it('Should create a blockchain instance', function () {
        assert.equal(blockchain.validateBlockChain(), true, 'A newly created blockchain should be valid')
    })
})