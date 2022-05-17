require('dotenv').config();
const express = require('express')
const cors = require('cors');
const mongoose = require("mongoose");
const app = express()
const event_subscriber = require('./event_subscriber');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use('/api', require('./routes/api'))
app.use(express.static(__dirname + "/../nft-minting-frontend/build"));
app.get('/*', function (req, res) {
	res.sendFile(__dirname + '/index.html', function (err) {
		if (err) {
			res.status(500).send(err)
		}
	})
})


const mongourl = require("./config/config").mongoURI;

mongoose.connect(mongourl, {useUnifiedTopology: true,useNewUrlParser: true,}).then(() => {
	console.log("MongoDB Connected")
	const port = require("./config/config").port;
	app.listen(port, () => console.log(`Server running on port ${port}`));
	event_subscriber.handleBuy();
}).catch((err) => console.log(err));

