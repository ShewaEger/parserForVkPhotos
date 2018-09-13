var minimist = require("minimist");

var args = minimist(process.argv.slice(2));
const {VK, Request} = require('vk-io');
var fs = require("fs");

var idApp = "*******";
var keyApp = "**********************";
var vk = new VK({token: keyApp});
const {api} = vk;

var InputFile = args._[0];
var OutputFile = args._[1];

var wstream = fs.createWriteStream(OutputFile);

function onSucces(value){
    var Users = [];    
    for(var i = 0; i < value.length; i++){
        let obj = {
            id: value[i].id,
            has_photo: value[i].has_photo
        }
        obj.blocked = value[i].deactivated ? 1: 0;
        //Users.push(obj)
        wstream.write(JSON.stringify(obj));
    }
}
function onFail(value){
    console.log(value);
}

function GetFromVk(ids){
    var a = new Request("users.get", {
        user_ids: ids,
        fields: "has_photo"
    })
    api.callWithRequest(a).then(onSucces, onFail);
}

var PageIdA = fs.readFileSync(InputFile, 'utf-8').split("\r\n");
var ids = "";
for(var i = 0; i < PageIdA.length; i++){

    if(i != 0 && !(i%1000)){
        GetFromVk(ids);
        flagNext = false;
        ids = "";
    }
    ids += PageIdA[i] + ",";
}
if(ids != ""){
    GetFromVk(ids);
}
