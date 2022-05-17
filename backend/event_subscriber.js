
const BlockNumController = require('./controllers/blockController');

const {	provider, StoreFront} = require('./contracts');

const handleBuy = () => {
	const handler = async (tx) => {
        console.log("*********************")
        console.log(tx)
		var tokenDatas = {
			address: tx.args._address,
			tokens: tx.args._tokens,
			price: tx.args._price
		};
		try {
            
            BlockNumController.control.confirmEvent(tokenDatas.tokens, tokenDatas.address)
		} catch (err) {
			console.log(
				"buy handle error:", err.message
			)
		}
	}

	handleEvent({
		id: "buy",
		provider: provider,
		contract: StoreFront,
		event: "Buy",
		times: 15,
		handler: handler
	});
    // setTimeout(() => {
    //     handleBuy()
    // }, 10000);
}

const handleEvent = (props) => {
    const { id, provider, contract, event, times, handler} = props;
    var latestblocknumber;
    const handletransactions = async () => {
        try {
            let blockNumber = await provider.getBlockNumber();
            if (blockNumber > latestblocknumber) {
                blockNumber = blockNumber - latestblocknumber > 20 ? latestblocknumber + 20 : blockNumber;
                console.log("currenct block: ", blockNumber, "latest block", latestblocknumber, "handle", blockNumber);
                var txhistory = contract.queryFilter(event, latestblocknumber + 1, blockNumber);
                await txhistory.then(async (res) => {
                    for (var index in res) {
                        handler(res[index]);
                    }
                });
                latestblocknumber = blockNumber;

                await BlockNumController.control.update({
                    id: 'buy',
                    lastblock: blockNumber
                });
            }
        } catch (err) {
            console.log("handleEvent err", err)
        }
        setTimeout(() => {
            handletransactions()
        }, 3000);
    }

    const handleEvent = async () => {
        var blockNumber = 0;
        try {
            blockNumber = (await BlockNumController.control.find({ id: id }));
            if(blockNumber){
                blockNumber = blockNumber.lastblock
            }
        } catch (err) {
            try {
                blockNumber = await provider.getBlockNumber();
                
                await BlockNumController.control.create({
                    id: id,
                    lastblock: blockNumber
                });
            } catch (err) {
                console.log("provider err,", err.message);
            }
        }
        latestblocknumber = Number(blockNumber);
        setTimeout(() => {
            handletransactions();
        }, times);
    }

    handleEvent();
}


module.exports = {handleBuy}