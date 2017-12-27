'use strict';

class Utils {
    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     * @param min The lower limit of the random number (inclusive)
     * @param max The upper limit of the random number (exclusive)
     * @returns A whole random number
     */
    getRandomRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

module.exports = new Utils()