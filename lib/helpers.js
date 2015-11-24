var fs = require('fs');
var path = require('path');

var createFolderIfNotExists = function (folderName) {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
};

var joinPath = function () {
    var ret = '';
    for (arg in arguments) {
        ret = path.join(ret, arguments[arg])
    }
    return ret;
};

module.exports = {
    mkdir: createFolderIfNotExists,
    join: joinPath
};