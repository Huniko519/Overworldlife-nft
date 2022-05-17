const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Block_schema = new Schema({
  id: { type: String, default: '' },
  lastblock: { type: Number, default: 0 }
});

const NumberModal = mongoose.model('blocknumber', Block_schema);
module.exports = NumberModal
