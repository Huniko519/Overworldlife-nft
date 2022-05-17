const router = require('express').Router();
const apiController = require('../controllers/apiController.js')
const generatorController = require('../controllers/generatorController')
const ipfsController = require('../controllers/ipfsController')



router.post("/generate-image", async (req, res) => {
    const response = await generatorController.generate_images();
    return res.send(response);
})
router.post("/get-price", async (req, res) => {
    const response = await apiController.getPrice();
    return res.send(response);
})

router.post("/upload-ipfs", async (req, res) => {
    const imageDir = './export-images';
    const response = await ipfsController.insertImageList(imageDir);
    return res.send(response);
})

router.post('/get-buy-params', async (req, res) => {
    var { count } = req.body
    count = parseInt(count)
    if (count < 1 && count >= 20) return res.send({ error: 1, msg: 'amount error' })
    var result = await apiController.getBuyParams(count);
    return res.json(result)
})


router.all('/*', async (req, res) => {
    res.send({ error: 404, result: { msg: '404' } })
})

module.exports = router