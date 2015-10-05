var fs = require('fs');
var cheerio = require('cheerio');
const SEL_WEEKS = '#region-main > div > div > ul',
    SEL_WEEKS_ITEM_NAME = 'div.content > h3',
    SEL_WEEKS_ITEM_FILES = 'div.content > ul',
    SEL_LINK = 'div > a';

var parseDom = function () {
    var $ = cheerio.load(fs.readFileSync('page.html'));
    return $($(SEL_WEEKS).html()).map(function (i, elem) {
        //var name = $(SEL_WEEKS_ITEM_NAME, elem).text().trim();
        //name = name.match(/.+\d+.+\d+.+/)? "Week "+i: "Announcements";
        var name = "Week "+i;
        // Have to reconstruct new Cheerio object via HTML
        var files = $($(SEL_WEEKS_ITEM_FILES, elem).html()).map(extractFiles($)).get();

        if (files && files.length != 0) {

            return {
                name: name,
                files: files
            }
        }
    }).get()
};

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
    return name.replace(" File", "")
};

// Exports a catalog
var cat = parseDom();

// Write catalog for future syncing needs
fs.writeFileSync('eportal-catalog.json',JSON.stringify(cat,null,'\t'));

//console.log(JSON.parse(fs.readFileSync('eportal-catalog.json')));