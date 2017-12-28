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
describe('database - sync', function () {
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
describe('database - async', function () {
    it('delete(key, cb) should work', function () {
        db.delete(expectedKey, () => { })
    })
    it('set(key, value, cb) should save values', function () {
        db.set(expectedKey, expectedValue, (data) => { })
    })
    it('get(key, cb) should be able to get the values we set', function () {
        db.get(expectedKey, (err, data) => {
            assert.equal(expectedValue.prop, data.prop)
            assert.equal(expectedValue.propString, data.propString)
        })
    })
    it('set(key, value, cb) should be able to update the value', function () {
        db.set(expectedKey, updatedValue, () => { })
    })
    it('get(key, cb) should be able to get the value we set', function () {
        db.getSync(expectedKey, (err, data) => {
            assert.equal(updatedValue.prop, data.prop)
            assert.equal(updatedValue.propString, data.propString)
        })
    })
    it('delete(key, cb) should delete the created values', function () {
        db.delete(expectedKey, () => {
            assert.equal(db.getSync(expectedKey), null)
        })
    })
})