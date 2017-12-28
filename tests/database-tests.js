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
describe('Database Tests - CRUD operations', function () {
    it('delete(key) should work', function () {
        db.delete(expectedKey).then(
            () => { assert.ok() }
        ).catch((err) => {
            assert.fail(err)
        })
    })
    it('set(key, value) should save values', function () {
        db.set(expectedKey, expectedValue).then(
            (data) => { assert.ok() }
        ).catch(
            (err) => assert.fail(err)
            )
    })
    it('get(key) should be able to get the values we set', function () {
        db.get(expectedKey).then((data) => {
            assert.equal(expectedValue.prop, data.prop)
            assert.equal(expectedValue.propString, data.propString)
        }).catch(
            (err) => assert.fail(err)
            )
    })
    it('set(key, value) should be able to update the value', function () {
        db.set(expectedKey, updatedValue).then(
            () => { }
        ).catch(
            (err) => assert.fail(err)
            )
    })
    it('get(key) should be able to get the value we set', function () {
        db.get(expectedKey).then((data) => {
            assert.equal(updatedValue.prop, data.prop)
            assert.equal(updatedValue.propString, data.propString)
        }).catch(
            (err) => assert.fail(err)
            )
    })
    it('delete(key) should delete the created values', function () {
        db.delete(expectedKey).then(() => {
            db.getS(expectedKey).then((data) => assert.equal(data, null))
        }).catch(
            (err) => assert.fail(err)
            )
    })
})