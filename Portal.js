var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
request = request.defaults({jar: true});

const LOGIN_URL = 'http://edimension.sutd.edu.sg/login/index.php',
    CREDENTIALS_PATH = 'credentials.json',
    ROOT_PATH = 'C:\\Users\\User\\Dropbox\\Machine Learning 2015\\';
//ROOT_PATH = 'files\\';

var credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
var catalog = JSON.parse(fs.readFileSync('eportal-catalog.json'));

var formData = {
    username: credentials.username,
    password: credentials.password
};

var loginOpts = {
    method: 'POST',
    url: LOGIN_URL,
    headers: {
        'postman-token': '52d20709-92a7-afb1-0c66-682a41753aee',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
    },
    formData: formData,
    followAllRedirects: true
};

// Gets resource (most likely PDF) link from DOM
var getResourceUrl = function (body) {
    var $ = cheerio.load(body);
    return $('#resourceobject').attr('data')
};

var sanitize = function (inp) {
    return inp.replace(/[\//'":]/g, "-"); //TODO incomplete cuz lazy
};

var downloadFolder = function (folder) {
    var folderName = ROOT_PATH + folder.name;
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
    folder.files.forEach(function (file) {
        var fileName = folderName + "\\" + sanitize(file.name);
        request(file.url, function (e, response, body) {
            var contentType = response.headers['content-type'];
            // If this link is a file, write out the body
            if (contentType && contentType.match(/document/)) {
                var ext = response.headers['content-disposition'].match(/\.[0-9a-z]+/i)[0];
                fileName = fileName + ext;
                console.log("Summoning: ", fileName);
                fs.writeFileSync(fileName, body);
            }
            // else we get the resource link from the DOM
            else if (url = getResourceUrl(body)) {
                var ext = url.match(/\.[0-9a-z]+$/i)[0];
                fileName = fileName + ext;
                console.log("Summoning: ", fileName);
                request(url).pipe(fs.createWriteStream(fileName));
            }
        })
    });
};

var openPortal = function (catalog) {
    console.log("Opening Portal with Incantations...")
    request(loginOpts, function (error, response, body) {
        if (error) throw new Error(error);
        catalog.forEach(downloadFolder);

    });
};

openPortal(catalog);