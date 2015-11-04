var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
request = request.defaults({jar: true});
var Settings = require('../settings');
var helpers = require('./helpers');

var COURSE_ROOT_PATH = "";

var getResourceUrl = function (body) {
    var $ = cheerio.load(body);
    return $('#resourceobject').attr('data')
};

var sanitize = function (inp) {
    return inp.replace(/[\//'":]/g, "-"); //TODO incomplete cuz lazy
};

var downloadFolder = function (folder) {
    var folderName = helpers.join(COURSE_ROOT_PATH, folder.name);
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
    folder.files.forEach(function (file) {
        var fileName = helpers.join(folderName, sanitize(file.name));
        request(file.url, function (e, response, body) {
            var contentType = response.headers['content-type'];
            var ext;
            // If this link is a file, write out the body
            if (contentType && contentType.match(/text\/html/)) {
                var url = getResourceUrl(body);
                ext = url.match(/\.[0-9a-z]+$/i)[0];
                fileName = fileName + ext;
                console.log("Summoning: ", fileName);
                request(url).pipe(fs.createWriteStream(fileName));
            }
            // else we get the resource link from the DOM
            else {
                ext = response.headers['content-disposition'].match(/filename=".+(\.[0-9a-z]+)"/i)[1];
                fileName = fileName + ext;
                console.log("Summoning: ", fileName);
                fs.writeFileSync(fileName, body);
            }
        })
    });
};

var open = function (catalog, coursePath) {
    console.log("Opening Portal...");
    request(Settings.LOGIN_OPTS, function (error, response, body) {
        if (error) throw new Error(error);
        COURSE_ROOT_PATH = coursePath;
        catalog.forEach(downloadFolder);

    });
};

// TODO should really learn how to pass an object here
module.exports = {
    open: open
};