var cheerio = require('cheerio');
var Settings = require('../settings');
const SEL_WEEKS = '#region-main > div > div > ul',
    SEL_WEEKS_ITEM_FILES = 'div.content > ul',
    SEL_LINK = 'div > a';

// Extracts files given the correct Cheerio context (most direct parent ul containing the links)
var extractFiles = function ($) {
    return function (index, elem) {
        var link = $(SEL_LINK, elem);
        var fileType = $('img', link).attr('alt');
        if (fileType === 'File') {
            var fileName = $('span', link).text();
            return {
                name: sanitizeFileName(fileName),
                url: link.attr('href')
            }
        }
    }
};

var sanitizeFileName = function (name) {
    // Retarded eDimension format
    return name.replace(" File File", "")
};

var parseDom = function (dom) {
    var $ = cheerio.load(dom);
    return $($(SEL_WEEKS).html()).map(function (i, elem) {
        var name = "Week " + i;
        // Have to reconstruct new Cheerio object via HTML
        var items = $(SEL_WEEKS_ITEM_FILES, elem).html();
        var files = $(items).map(extractFiles($)).get();
        if (files && files.length != 0) {
            return {
                name: name,
                files: files
            }
        }
    }).get()
};

var dispatch = function (course, portal) {
    var URL = course.url;
    if (!URL.match(/.+\/course\/.+/i)) {
        throw('Invalid URL: ' + URL + '. \n "Please input a proper course URL e.g. http://edimension.sutd.edu.sg/course/view.php?id=1035"');
    }
    console.log("Dispatching Minion to " + URL + "...");
    request(Settings.LOGINOPTS, function (err, res, b) {
        if (error) throw new Error(error);
        request(URL, function (e, r, body) {
            var cat = parseDom(body);
            var path = Settings.ROOT_PATH + course.name + "\\catalog.json";
            //TODO compare json here

            // TODO portal all the diff
            fs.writeFileSync(path, JSON.stringify(cat, null, '\t'));

        })
    });
};

module.exports = {
    dispatch: dispatch
};