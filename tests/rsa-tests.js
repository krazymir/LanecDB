'use strict';

const assert = require('assert')
const utils = require('../modules/utils')

let data = 'Some string to be encrypted'
let encryptedData

describe('Initialization - encrypt/descrypt', function () {
    it('encrypt(data) should encrypt the data', function () {
        encryptedData = utils.encrypt(data)
    })
    it('decrypt(data, privateKey) should decrypt the encrypted data', function () {
        let decryptedData = utils.decrypt(encryptedData)
        assert.equal(decryptedData, data, 'The decripted string must mach the string before encryption')
    })
})