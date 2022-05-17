const router = require('express').Router();
const NftController = require('../controllers/nftController.js')

router.post('/get-buy-params', async (req, res) => {
    const { count } = req.body
    if(count<1 && count>=20) return res.send({error:1, msg:'amount error'})
    var result=await NftController.getBuyParams(count);
    return res.send(result)
})

router.post('/mint-nft', async(req, res) => {
    var id= req.body.id;
    var result=await NftController.mintNft(id);
    return res.send(result)
})

router.post('/sign', async(req, res) => {
    var result=await NftController.sign(["0x14421914c42cd62e796e0a16ea5aaf7b852cd056b35c148c9acabd8db05909fa"], "0xDE0B6B3A7640000");
    return res.send(result)
})

router.all('/*', async(req, res)=>{
    res.send({error:404, result:{msg:'404'}})
})

module.exports = router