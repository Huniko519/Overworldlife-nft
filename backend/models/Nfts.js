const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NFT_Schema = new Schema({
  filehash: { type: String, default: '' },
  metahash: { type: String, default: '' },
  meta: { type: Object, default: '' },
  address: { type: String, default: '' },
  tokenId: { type: String, default: '' },
  status: { type: Number, default: 0 },
});

const NftModal = mongoose.model('nftdata', NFT_Schema);
module.exports = {NftModal}
