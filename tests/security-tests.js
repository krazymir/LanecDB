'use strict';

const assert = require('assert')
const utils = require('../modules/utils')

const data = 'Some string to be encrypted'
let encryptedData
let signature

describe('Initialization - encrypt/descrypt', function () {
    it('encrypt(data) should encrypt the data', function () {
        encryptedData = utils.security.encrypt(data)
    })
    it('decrypt(data, privateKey) should decrypt the encrypted data', function () {
        let decryptedData = utils.security.decrypt(encryptedData)
        assert.equal(decryptedData, data, 'The decripted string must mach the string before encryption')
    })
    // it('sign(data, key) should sign the data and return a signature', function () {
    //     signature = utils.security.sign(data)
    // })
    // it('verifySignature(data, signature, key) should verify the data signature', function () {
    //     assert.equal(utils.security.verifySignature(data, signature, utils.security.getPublicKey()), true, 'The signature should be ok')
    // })
})