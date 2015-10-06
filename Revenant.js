var Revenant = require('revenant');
var fs = require('fs');
var cheerio = require('cheerio');
const URL = 'http://edimension.sutd.edu.sg/course/view.php?id=1035', // todo get this from arg
    CREDENTIALS_PATH = 'credentials.json',
    SEL_FORM = '#login',
    SEL_USER = '#username',
    SEL_PASS = '#password',
    SEL_LOGIN_BUTTON = '#loginbtn';

var credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

if (!URL.match(/.+\/course\/.+/i)) {
    console.log("Please input a proper course URL e.g. http://edimension.sutd.edu.sg/course/view.php?id=1035");
    return;
}
// TODO check body on load / check for array of elements

console.log("Dispatching Revenant to " + URL + " ...");
var browser = new Revenant();
browser
    .openPage(URL)
    .then(function () {
        // Assume we will always be redirected to login page every time
        return browser.waitForElement(SEL_FORM);
    })
    .then(function () {
        browser.fillForm(SEL_USER, credentials.username);
        browser.fillForm(SEL_PASS, credentials.password);
        return browser.clickElement(SEL_LOGIN_BUTTON, 1);
    })
    .then(function () {
        return browser.getUrl()
    })
    .then(function (currentUrl) {
        if(currentUrl !== URL){
            console.log("Invalid login credentials! (probably..)")
            browser.done()
        }
        return browser.takeSnapshot()
    })
    .then(function (dom) {
        fs.writeFileSync('page.html', dom);
        browser.done();
    })
    .fail(function (error) {
        console.log("Error: ", error);
        browser.done();
    });

