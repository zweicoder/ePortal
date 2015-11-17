#!/usr/bin/env node
var arguments = process.argv.slice(2);
var fs = require('fs');
var usage = fs.readFileSync(__dirname + '/usage.txt').toString();

if (arguments.length < 3) {
    console.error(usage);
    return;
}

var summon = require('./Summoner');

summon(arguments[0], arguments[1], arguments[2]);
