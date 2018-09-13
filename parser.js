var minimist = require("minimist");

var args = minimist(process.argv.slice(2));

var InputFile = args._[0];
var OutputFile = args._[1];


var fs = require("fs");