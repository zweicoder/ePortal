var fs = require('fs');
var cheerio = require('cheerio');

//todo get relative path to where the files will be dumped
const PAGE_PATH = 'page.html',
    CATALOG_PATH = 'eportal-catalog.json',
    SEL_WEEKS = '#region-main > div > div > ul',
    SEL_WEEKS_ITEM_FILES = 'div.content > ul',
    SEL_LINK = 'div > a';

var parseDom = function () {
    var $ = cheerio.load(fs.readFileSync(PAGE_PATH));
    return $($(SEL_WEEKS).html()).map(function (i, elem) {
        var name = "Week " + i;
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
    // Retarded eDimension format
    return name.replace(" File File", "")
};

console.log("Preparing incantations...");
// Exports a catalog
var cat = parseDom();

// Write catalog for future syncing needs
fs.writeFileSync(CATALOG_PATH, JSON.stringify(cat, null, '\t'));