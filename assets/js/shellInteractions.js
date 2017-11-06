/*
All website links within the UI should be opened with a default program. Copora tables too.
Dictionary tables have special rules for search results and search field input.
*/

// Manage Shell interactions - https://github.com/electron/electron/blob/master/docs/api/shell.md
const {shell} = require('electron')

var doc = document;

//Disable evals for scripts
window.eval = global.eval = function() {
	throw new Error("Sorry, we do not support window.eval() for security reasons.");
}

//Disable drag drop events
doc.addEventListener('dragover', function (e) {e.preventDefault()});
doc.addEventListener('drop', function (e) {e.preventDefault()});

// pagination check
var page = window.location.href;
if (page.endsWith("index.html")) {
	index();
} else {
	window.addEventListener('click', defaultClickback, false);
	window.addEventListener('auxclick', defaultClickback, false);
}

// for the page named "index.html"
function index () {
	//Assign an audio player (currently only for ldoce/longman dictionary)
	var globalAudio = doc.getElementById('globalAudioPlayer');
	function playAudio(e) {
		var e = window.e || e;
		var audioFile = e.target.getAttribute("data-src-mp3");
		if (audioFile) {
			globalAudio.src = audioFile;
			globalAudio.play();
		}
	}
	doc.addEventListener('click', playAudio, true);

	// From the tabOne (dictionary) div, input clicked URL's inner website URL text as terms into the searchbar
	function tabOneClickback(e) {
		var e = window.e || e;

		//return if right click
		if (e.which == 3) {
			return;
		}

		// if this is a clicked URL
		if (e.target.localName == 'a' || e.target.localName == 'A' || e.target.parentNode.nodeName == 'a' || e.target.parentNode.nodeName == 'A') {
			e.preventDefault();
			// For dictionary results, load other results in like iframes for that dictionary only
			var url = e.target.parentNode.href || e.target.href;
			if (url.startsWith("http://ejje.weblio.jp/content/") || url.startsWith("https://ejje.weblio.jp/content/")) {
				weblioDictionary(url);
				return;
			}
			if (url.startsWith("http://kotobank.jp/word/") || url.startsWith("https://kotobank.jp/word/")) {
				kotobankDictionary(url);
				return;
			}
			if (url.startsWith("http://www.ldoceonline.com/dictionary/") || url.startsWith("https://www.ldoceonline.com/dictionary/") || url.startsWith("http://www.ldoceonline.com/search/direct/") ||  url.startsWith("https://www.ldoceonline.com/search/direct/")) {
				ldoceDictionary(url);
				return;
			}
			// Else, open default
			//defaultClickback(e);
			// Else, input the clicked URL text into the input box for searching
			var input = doc.getElementById("search").elements["searchbar"];
			input.value = e.target.innerText;
		}
	}
	// Dictionary tab
	var tabOne = doc.getElementById("tabOne");
	tabOne.addEventListener('click', tabOneClickback, false);
	// Corpora tab
	var tabTwo = doc.getElementById("tabTwo");
	tabTwo.addEventListener('click', defaultClickback, false);
	tabTwo.addEventListener('auxclick', defaultClickback, false);
}

// Open other URLs with default programs and not Electron
function defaultClickback(e) {
	var e = window.e || e;

	//return if right click
	if (e.which == 3) {
		return;
	}

	if (e.target.localName == 'a') {
		e.preventDefault();
		shell.openExternal(e.target.href);
	}
}