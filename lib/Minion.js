var fs = require('fs');
var cheerio = require('cheerio');
var Settings = require('../settings');
var request = require('request');
var helpers = require('./helpers');
request = request.defaults({jar: true});
var _ = require('underscore');
var path = require('path');
var fnSanitize = require("sanitize-filename");

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
    return fnSanitize(name.replace(" File File", ""))
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

var getDiff = function (updated, old) {
    var indexByNames = _.partial(_.indexBy, _, 'name');
    var updatedItems = indexByNames(updated),
        oldItems = indexByNames(old);
    var nameDiffs = _.difference(_.keys(updatedItems), _.keys(oldItems));
    var diffs = _.map(nameDiffs, function (name) {
        return updatedItems[name]
    });
    _.each(_.intersection(_.keys(updatedItems), _.keys(oldItems)), function (name) {
        // group exists, check for diff files
        // cannot DRY because we need intermediate vars
        var indexByUrl = _.partial(_.indexBy, _, 'url');
        var updatedFies = indexByUrl(updatedItems[name].files);
        var oldFiles = indexByUrl(oldItems[name].files);
        var urlDiffs = _.difference(_.keys(updatedFies), _.keys(oldFiles));
        var files = _.map(urlDiffs, function (url) {
            return updatedFies[url]
        });
        if (files.length > 0) {
            diffs.push({
                name: name,
                files: files
            })
        }
    });
    return diffs;
};

var dispatch = function (course, portal) {
    var URL = course.url;
    if (!URL.match(/.+\/course\/.+/i)) {
        throw('Invalid URL: ' + URL + '. \n "Please input a proper course URL e.g. http://edimension.sutd.edu.sg/course/view.php?id=1035"');
    }
    console.log("Dispatching Minion to " + URL + "...");
    request(Settings.LOGIN_OPTS, function (error, res, b) {
        if (error) throw new Error(error);

        request(URL, function (e, r, body) {
            var newCatalog = parseDom(body);
            var coursePath = helpers.join(Settings.ROOT_PATH, course.name);
            var path = helpers.join(coursePath, "catalog.json");
            if (fs.existsSync(path)) {
                console.log("Updating catalog...");
                var oldCatalog = JSON.parse(fs.readFileSync(path));
                var diffs = getDiff(newCatalog, oldCatalog);
                if (diffs) portal(diffs, coursePath)
            } else {
                console.log("Downloading new catalog...");
                portal(newCatalog, coursePath)
            }

            fs.writeFileSync(path, JSON.stringify(newCatalog, null, '\t'));

        })
    });
};

module.exports = {
    dispatch: dispatch
};