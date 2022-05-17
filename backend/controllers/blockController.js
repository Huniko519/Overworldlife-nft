
const NumberModal = require('../models/Blocks')
const blockNumController = {
    create: async (props) => {
        try{
            var { lastblock, id } = props;
            const instance = new NumberModal({lastblock, id});
            var res = await instance.save();
            return {
                lastblock: res.lastblock,
            };
        }catch(ex){
            return {err:1, msg:ex}
        }
    },
    update: async (props) => {
        var { lastblock, id } = props;
        await NumberModal.updateMany(
            { id:id},
            {
                $set: { lastblock: lastblock },
                $currentDate: { lastModified: true },
            }
        );
        return true;
    },
    find: async (props) => {
        var { id } = props;
        var res = await NumberModal.findOne({ id:'buy' });
        return res;
    },
    confirmEvent: async (tokenIds, address) => {
        try {
            console.log(tokenIds, address)
            await update({ tokenId:{ $in:tokenIds } }, { $set:{ address:address, status:10 } })
            return { err: 0, msg: 'success' }
        } catch (ex) {
            return { err: 1, msg: ex }
        }
    }
};

module.exports = { control:blockNumController }