var createFolderIfNotExists = function(folderName){
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
};

module.exports({
    mkdir: createFolderIfNotExists
});