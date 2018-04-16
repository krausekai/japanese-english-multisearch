const tabs = require("./js/tabs");
const inputFocus = require("./js/inputFocus");
const searchHistory = require("./js/searchHistory");
const webScraper = require("./js/webscraper");
const shellinteractions = require("./js/shellInteractions");

// RakutenMA Tokenizer
var rakuten;
const RakutenMA = require("rakutenma");
const fs = require("fs");
const path = require("path");
const rakutenModelPath = path.join(__dirname, "./js/rakutenma/model_ja.min.json");
fs.readFile(rakutenModelPath, "utf8", (err, data) => {
	let model = JSON.parse(data);
	rakuten = new RakutenMA(model);
	rakuten.featset = RakutenMA.default_featset_ja;
	rakuten.hash_func = RakutenMA.create_hash_func(15);
});


// app interaction
var doc = document;
var lastSearchTime = Date.now();
function searchBar() {
	// rate limit searches to 1 second
	var currentSearchTime = Date.now();
	var difference = (currentSearchTime - lastSearchTime) / 1000;
	if (difference <= 1) return;
	lastSearchTime = Date.now();

	//Get the search term
	var searchBar = doc.getElementById("search").elements["searchbar"];
	var searchTerm = searchBar.value.trim();
	if (searchTerm == "") return;

	// Add the term to search history
	searchHistory.add(searchTerm);

	// Get search type
	var searchType = doc.getElementById("search").elements["searchType"].value;

	// Tokenize sentences if there are multiple terms, from the dictionary tab
	var terms = rakuten.tokenize(searchTerm);
	var glossForm = document.getElementById("glossForm");
	if (terms.length > 1 && searchType == "dictionary") {
		// show visibility
		glossForm.innerHTML = "";
		glossForm.style.visibility = "visible";
		for (var i = 0; i < terms.length; i++) {
			// Remove term types (eg. noun, verb)
			terms[i] = terms[i][0];
			// tie this into shell interactions as a safe search term
			glossForm.innerHTML += "<a class='token' href='#glossToken'>" + terms[i] + "</a>";
		}
	}

	//Reset the scrollbar
	var tableBodies = doc.getElementsByClassName("tbodySize");
	for (var i = 0; i < tableBodies.length; i++) {
		tableBodies[i].scrollTop = 0;
	}

	//Perform the search
	if (searchType == "dictionary") webScraper.dictionarySearch(searchTerm);
	if (searchType == "corpus") webScraper.corpusSearch(searchTerm);
}


window.onload = function () {
	// Onload events
	tabs.onload();
	searchHistory.onload();
	inputFocus.onload();
	shellinteractions.onload();

	// app interaction
	var searchform = doc.getElementById("freeSearchForm");
	searchform.addEventListener("submit", searchBar, false);
	var searchformbutton = doc.getElementById("search").elements["searchbutton"];
	searchformbutton.addEventListener("click", searchBar, false);
}
