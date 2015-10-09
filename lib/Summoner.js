var Minion = require('./Minion');
var Settings = require('../settings');
var fs = require('fs');
var helpers = require('./helpers');
var Portal = require('./Portal');

const COURSES = Settings.COURSES;

// Initialize all folders at target path / folder
helpers.mkdir(Settings.ROOT_PATH);
COURSES.forEach(function (course) {
    var folderName = Settings.ROOT_PATH + course.name;
    helpers.mkdir(folderName)
});

Minion.dispatch(COURSES[0], Portal.open);