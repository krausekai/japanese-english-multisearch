// electron app
const app = require('electron').remote.app;

// Manage Shell interactions - https://github.com/electron/electron/blob/master/docs/api/shell.md
const {shell} = require('electron')

// For opening new windows or importing files
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

// For http requests - //https://github.com/request/request
const request = require('request');
const requestOptions = {headers: {'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"}};
const statusCodeMeaning = require('./js/statusCodeMeaning.js');

// For jquery-like node.js - //https://cheerio.js.org/
const cheerio = require('cheerio');