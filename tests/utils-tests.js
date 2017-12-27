'use strict';
let assert = require('assert');
let utils = require('./../modules/utils');

describe('utils', function () {
    it('utils.getRandomRange(min, max) should return a whole number, larger than or equal to min and less than max', function () {
        let value = utils.getRandomRange(1000, 100000)
        assert(!isNaN(value) && value >= 1000 && value < 100000 && Math.floor(value) === value)
    })
})