const tabs = require("./js/tabs");
const inputFocus = require("./js/inputFocus");
const searchHistory = require("./js/searchHistory");
const webScraper = require("./js/webscraper");
const shellinteractions = require("./js/shellInteractions");

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
