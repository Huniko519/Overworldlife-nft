require('dotenv').config()

const bs58 = require('bs58')
const ethers = require('ethers')
/* const keccak256 = require('keccak256') */
const { NftModal } = require('../models/Nfts')
const config = require('../config/config')
let Price = ethers.utils.parseEther(config.NFT_price).toHexString();
const signerKey = process.env.SIGNERKEY || ''



sign = async (tokens, price) => {
    try {
        const wallet = new ethers.Wallet(signerKey)
        let messageHash = ethers.utils.solidityKeccak256(["uint256[]", "uint"], [tokens, price]);
        let signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
        return signature
    } catch (err) {
        console.log(err)
    }
    return null
}
getBuyParams = async (count) => {
    try {
        const tokens = []
        var rows = await NftModal.find({ address: '' }).sort({ tokenId: 1 }).limit(count);
        if (rows.length < count) return { err: 2, msg: 'balance is less than count' }
        if (rows) {
            for (let i of rows) tokens.push('0x' + i.tokenId)
        }   
        const signature = await sign(tokens, Price)
        for (let i of tokens) {
            await NftModal.updateMany({ tokenId: i.substring(2) }, { address: 'dfsdf' })
        }
        return { err: 0, msg: { tokens, price: Price, signature } };
    } catch (ex) {
        console.log(ex)
        return { err: 1, msg: ex }
    }
}
getPrice = async () => {
    try {
        var totalSales = await NftModal.find({ address: { $ne: '' } }).count();
        var price = totalSales >= 888 ? config.NFT_price : '0';
        Price = ethers.utils.parseEther(price).toHexString();
        return { err: 0, price: price };
    } catch (ex) {
        console.log(ex)
        return { err: 1, msg: ex }
    }
}
insertData = async (props) => {
    try {
        const instance = new NftModal(props);
        var res = await instance.save();
        return { err: 0, msg: 'success', data: res }
    } catch (ex) {
        return { err: 1, msg: ex }
    }
}
updateJsonHash = async (id, metahash, meta) => {
    try {
        const bytes = bs58.decode(metahash)
        const hex = Buffer.from(bytes).toString('hex')
        const tokenId = hex.slice(4)
        await NftModal.updateOne({ _id: id }, { metahash, tokenId, meta });
        return { err: 0, msg: 'success' }
    } catch (ex) {
        return { err: 1, msg: ex }
    }
}
module.exports = { sign, getBuyParams, getPrice, insertData, updateJsonHash }