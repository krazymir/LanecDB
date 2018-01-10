'use strict';

const assert = require('assert')
const utils = require('../modules/utils')
const security = utils.security

const data = 'Some string to be encrypted'
let encryptedData
let signature
var td = require('testdouble')

// Setting up request
let req = {}
req.get = td.function()
req.body = '{"prop":5}'
td.when(req.get('pub')).thenReturn(security.getPublicKey())
td.when(req.get('sig')).thenReturn(security.signString(req.body))

// Setting up response
let res = {}
res.status = td.function()
res.send = td.function()
res.end = td.function()
td.when(res.status(200)).thenReturn(res)
td.when(res.status(400)).thenReturn(res)
td.when(res.status(401)).thenReturn(res)
td.when(res.send('Bad Request')).thenReturn(res)
td.when(res.send('Unauthorized')).thenReturn(res)
td.when(res.end()).thenReturn(res)

describe('Initialization - encrypt/descrypt', function () {
    it('encrypt(data) should encrypt the data', function () {
        encryptedData = utils.security.encrypt(data)
    })
    it('decrypt(data, privateKey) should decrypt the encrypted data', function () {
        let decryptedData = utils.security.decrypt(encryptedData)
        assert.equal(decryptedData, data, 'The decripted string must mach the string before encryption')
    })
    it('sign(data, key) should sign the data and return a signature', function () {
        signature = utils.security.signString(data)
    })
    it('verifySignatureString(stringData, signature, key) should verify the data signature', function () {
        assert.equal(utils.security.verifySignatureString(data, signature, utils.security.getPublicKey()), true, 'The signature should be ok')
    })
    it('authorizeRequest(req, res) should verify the request and check its correctness', function () {
        assert.equal(security.authorizeRequest(req, res), true, 'The request should be valid')
    })
    it('authorizeRequest(req, res) should not authorize a request with if the data is changed subsequently', function () {
        req.body = '{"prop":6}'
        assert.equal(security.authorizeRequest(req, res), false, 'The request should not be valid')
        // Resetting the body back to the original for the next test
        req.body = '{"prop":5}'
    })
    it('authorizeRequest(req, res) should not authorize a request with if the signature is changed', function () {
        td.when(req.get('sig')).thenReturn(security.signString('A different string'))
        assert.equal(security.authorizeRequest(req, res), false, 'The request should not be valid')
        // Resetting the signature back to the original for the next test
        let signature = security.signString(req.body)
    })
    it('authorizeRequest(req, res) should not authorize a request with if the public key is missing', function () {
        td.when(req.get('pub')).thenReturn(null)
        assert.equal(security.authorizeRequest(req, res), false, 'The request should be valid')
        // Resetting the public key back to the original for the next test
        td.when(req.get('pub')).thenReturn(security.getPublicKey())
    })
    it('authorizeRequest(req, res) should not authorize a request with if the signature is missing', function () {
        td.when(req.get('sig')).thenReturn(null)
        assert.equal(security.authorizeRequest(req, res), false, 'The request should be valid')
        // Resetting the signature back to the original for a potential next test, when such is added
        td.when(req.get('sig')).thenReturn(signature)
    })
})