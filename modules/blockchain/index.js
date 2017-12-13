var block = require('./block');
global._blockchain = [block.getGenesisBlock()];
module.exports = block;