'use strict';

let assert = require('assert')
let db = require('./../modules/database')('test-cluster')

let expectedKey = 'key'
let expectedValue = {
    prop: 5,
    propString: 'Some string'
}
let updatedValue = {
    prop: 7,
    propString: 'New string'
}
describe('database', function () {
    it('deleteSync(key) should work', function () {
        db.deleteSync(expectedKey)
    })
    it('setSync(key, value) should save values', function () {
        db.setSync(expectedKey, expectedValue)
    })
    it('getSync(key) should be able to get the values we set', function () {
        let actual = db.getSync(expectedKey)
        assert.equal(expectedValue.prop, actual.prop)
        assert.equal(expectedValue.propString, actual.propString)
    })
    it('setSync(key, value) should be able to update the value', function () {
        db.setSync(expectedKey, updatedValue)
    })
    it('getSync(key) should be able to get the value we set', function () {
        let actual = db.getSync(expectedKey)
        assert.equal(updatedValue.prop, actual.prop)
        assert.equal(updatedValue.propString, actual.propString)
    })
    it('deleteSync(key) should delete the created values', function () {
        assert.equal(db.deleteSync(expectedKey), true)
    })
})