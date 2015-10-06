var Revenant = require('revenant');
var fs = require('fs');
var cheerio = require('cheerio');
var _ = require('underscore');
const LOGIN_URL = 'http://edimension.sutd.edu.sg/login/index.php', // todo get this from arg / json file
    CREDENTIALS_PATH = 'credentials.json',
    SEL_FORM = '#login',
    SEL_USER = '#username',
    SEL_PASS = '#password',
    SEL_LOGIN_BUTTON = '#loginbtn';

var credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

// TODO Read from catalog and get list of urls from a summoner.js

// Download the files
//var targets=['http://edimension.sutd.edu.sg/mod/resource/view.php?id=45346'];
var targets=['http://edimension.sutd.edu.sg/mod/resource/view.php?id=45346'];
console.log("Logging in...");
var browser = new Revenant();
browser
    .openPage(LOGIN_URL)
    .then(function () {
        // Assume we will always be redirected to login page every time
        return browser.waitForElement(SEL_FORM);
    })
    .then(function () {
        browser.fillForm(SEL_USER, credentials.username);
        browser.fillForm(SEL_PASS, credentials.password);
        return browser.clickElement(SEL_LOGIN_BUTTON, 1);
    })
    // Skipping login checks cause credentials have to be valid to be at this stage
    .then(function () {
        console.log("Opening Portal to " + targets[0] + " ...");
        return browser.navigateToUrl(targets[0]);
    })
    .catch(function (e) {
        // Catch the response and see if it's a document on error
        var lastResponse = browser.getLastResponse();
        var contentType = _.find(lastResponse.headers, function (elem) {
            return elem.name.toLowerCase() === 'Content-Type'.toLowerCase()
        });
        if(contentType && contentType.value.match(/document/)){
            console.log(lastResponse.url);
            // TODO collate all (fileName, links) and pipe to request
        }
        //TODO what to do otherwise
        return browser.getUrl()
    })
    .then(function (dom) {
        console.log(dom);
        browser.done()
    })
    .fail(function (error) {
        console.log("Error: ", error);
        browser.done();
    });

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
var downloadFiles = function(files){
    request(loginOpts, function (error, response, body) {
        if (error) throw new Error(error);
        // TODO get tuple of fileName , link
        // TODO download all files here
        // for all links limit to 5 send get request and queue others
        _.each(files, function () {
            // send to queue
            request(files.url)
                .pipe(fs.createWriteStream(files.name));
        });

    });
};
