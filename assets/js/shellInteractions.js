/*
All website links within the UI should be opened with a default program. Copora tables too.
Dictionary tables have special rules for search results and search field input.
*/
var shellInteractions = module.exports = {};

const {shell} = require("electron");

var doc = document;

shellInteractions.onload = function () {
	//Disable evals for scripts
	window.eval = global.eval = function() {
		return;
	}

	//Disable drag drop events
	doc.addEventListener('dragover', function (e) {e.preventDefault()});
	doc.addEventListener('drop', function (e) {e.preventDefault()});

	// pagination function setup
	var page = window.location.href;
	if (page.endsWith("index.html")) {
		// Audio
		doc.addEventListener('click', playAudio, true);
		// Dictionary tab
		const webScraper = require("./webscraper");
		var tabOne = doc.getElementById("tabOne");
		tabOne.addEventListener('click', tabOneClickback, false);
		tabOne.addEventListener('auxclick', defaultClickback, false);
		// Corpora tab
		var tabTwo = doc.getElementById("tabTwo");
		tabTwo.addEventListener('click', defaultClickback, false);
		tabTwo.addEventListener('auxclick', defaultClickback, false);
	}
	if (!page.endsWith("index.html")) {
		window.addEventListener('click', defaultClickback, false);
		window.addEventListener('auxclick', defaultClickback, false);
	}
}

// for the page named "index.html"
function playAudio(e) {
	var e = window.e || e;
	var audioFile = e.target.getAttribute("data-src-mp3");
	if (audioFile) {
		if (!audioFile.includes("ldoceonline.com")) {
			audioFile = "https://www.ldoceonline.com/" + audioFile;
		}
		//Assign an audio player for ldoce/longman dictionary
		var globalAudio = doc.getElementById('globalAudioPlayer');
		globalAudio.src = audioFile;
		globalAudio.play();
	}
}
function tabOneClickback(e) {
	var e = window.e || e;

	//return if right click
	if (e.which == 3) return;

	// if this is a clicked URL
	if (e.target.localName == "a" || e.target.localName == "A" || e.target.parentNode.nodeName == "a" || e.target.parentNode.nodeName == "A") {
		e.preventDefault();

		var url = e.target.parentNode.href || e.target.href;

		// Fix file:\\ paths
		var target = e.target || e.srcElement;

		var targetClass = target.className;
		if (url.startsWith("file:") && !url.endsWith("#glossToken")) {
			while(target) {
				if (targetClass == "ldoceDictOutput" || targetClass == "kotobankDict") {
					break;
				}
				target = target.parentNode;
				targetClass = target.className;
			}

			url = url.slice(11);
			if (targetClass == "ldoceDictOutput") {
				url = "https://www.ldoceonline.com/" + url;
			}
			else if (targetClass == "kotobankDict") {
				url = "https://kotobank.jp/" + url;
			}
		}


		if (url.endsWith("#glossToken")) {
			doc.getElementById("search").elements["searchbar"].value = e.target.innerText;
			doc.getElementById("search").elements["searchbutton"].click();
		}
		else if (url.startsWith("http://ejje.weblio.jp/content/") || url.startsWith("https://ejje.weblio.jp/content/")) {
			webScraper.weblioDictionary(url);
		}
		else if (url.startsWith("https://kotobank.jp/word/") || url.startsWith("https://kotobank.jp/word/")) {
			webScraper.kotobankDictionary(url);
		}
		else if (url.startsWith("http://www.ldoceonline.com/") || url.startsWith("https://www.ldoceonline.com/")) {
			webScraper.ldoceDictionary(url);
		}
		else {
			// Else, input the clicked URL text into the input box for searching
			var input = doc.getElementById("search").elements["searchbar"];
			input.value = e.target.innerText;
		}
	}
}

// Open other URLs with default programs and not Electron
function defaultClickback(e) {
	var e = window.e || e;

	//return if right click
	if (e.which == 3) return;

	if (e.target.localName == "a" || e.target.localName == "A" || e.target.parentNode.nodeName == "a" || e.target.parentNode.nodeName == "A") {
		e.preventDefault();
		shell.openExternal(e.target.href);
	}
}
