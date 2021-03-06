var Minion = require('./lib/Minion');
var Settings = require('./settings');
var helpers = require('./lib/helpers');
var Portal = require('./lib/Portal');
var path = require('path');

function summon(username, password, directory) {
    var savePath;
    if (!directory) {
        savePath = Settings.ROOT_PATH;
    } else {
        if (directory === '.') {
            savePath = process.cwd();
        } else {
            savePath = path.join(process.cwd(), directory)
        }
    }

    console.log('Summoning to location: ' + savePath);
    Settings.ROOT_PATH = path.normalize(savePath) || Settings.ROOT_PATH;
    Settings.LOGIN_OPTS.formData.username = username;
    Settings.LOGIN_OPTS.formData.password = password;

    const COURSES = Settings.COURSES;

    // Initialize all folders at target path / folder
    helpers.mkdir(Settings.ROOT_PATH);
    COURSES.forEach(function (course) {
        var folderName = helpers.join(Settings.ROOT_PATH, course.name);
        helpers.mkdir(folderName);
        Minion.dispatch(course, Portal.open)
    });
}

module.exports = summon;
