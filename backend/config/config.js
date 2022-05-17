require("dotenv").config();
module.exports = {
    mongoURI: "mongodb://localhost:27017/nfts",
    port: process.env.PORT,
    pinataApiKey: process.env.pinataApiKey,
    pinataSecretApiKey: process.env.pinataSecretApiKey,
    NFT_price: process.env.NFT_price
};
