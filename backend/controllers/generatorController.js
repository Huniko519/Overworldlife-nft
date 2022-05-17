const fs = require('fs');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const path= require('path')

const initDatas = {
    dirs: ["datas/foot", "datas/body", "datas/head", "datas/back", "datas/wing", "datas/horn", "datas/eye"],
    resImgPath: "export-images",
    resDataPath: "exports/hashes.json",
    combineDatas: [],
    index: 0
}

const combineImages = async ({imageDatas, resPath}) => {
    try{
        var bs64 = await mergeImages(imageDatas, {
            Canvas: Canvas,
            Image: Image
        });
        var bs64 = bs64.replace(/^data:image\/png;base64,/, "");
        console.log(`generating  ${resPath}`)
        fs.writeFileSync(resPath, bs64, 'base64', (err) => {
            console.log("save error", err);
            return false;
        })
    }catch(error){
        console.log(error);
        return false;
    }
    return true;
}

const generate_images = async () => {
    try{
        var totalCount = 0;
        const generate = async ({ dirs, combineDatas, resImgPath, index }) => {
            if(!fs.existsSync(resImgPath)){
                fs.mkdirSync(resImgPath)
            }
            if (dirs[index] == null) {
                await combineImages({ imageDatas: combineDatas, resPath: `${resImgPath}/res_${totalCount}.png` });
                totalCount++;
                return;
            }
            const length = fs.readdirSync(dirs[index]).length;
            for (var i = 1; i <= length; i++) {
                await generate({ dirs, combineDatas: combineDatas.concat([`${dirs[index]}/c (${i}).png`]), index: index + 1, resImgPath })
            }
        }
        if(fs.existsSync(initDatas.resImgPath)){
            fs.rmSync(path.resolve(initDatas.resImgPath), {recursive:true, force:true});
        }
        await generate(initDatas);
        console.log((totalCount) +" images created");
        return {err:0, msg:'success', total:totalCount}
    }catch(error){
        console.log(error)
        return false
    }
}


module.exports = {
    generate_images
}