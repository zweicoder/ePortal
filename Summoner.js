var Minion = require('./lib/Minion');
var Settings = require('./settings');
var helpers = require('./lib/helpers');
var Portal = require('./lib/Portal');

const COURSES = Settings.COURSES;

// Initialize all folders at target path / folder
helpers.mkdir(Settings.ROOT_PATH);
COURSES.forEach(function (course) {
    var folderName = Settings.ROOT_PATH + course.name;
    helpers.mkdir(folderName);
    Minion.dispatch(course, Portal.open)
});