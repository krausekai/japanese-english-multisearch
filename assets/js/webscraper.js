// For http requests - //https://github.com/request/request
var request = require('request-promise');
// For jquery-like node.js - //https://cheerio.js.org/
var cheerio = require('cheerio');

// Thanks to https://stackoverflow.com/a/23303587/1679669
// Fix broken chains for SSL Certificates by adding their authority to the trust
var fs = require("fs");
var path = require("path");
var https = require("https"), cas;
require("ssl-root-cas").inject();
var cas = https.globalAgent.options.ca;
// ALC.co.jp
cas.push(fs.readFileSync(path.join(__dirname, "./ssl/GlobalSignOrganizationValidationCA-SHA256-G2.crt")));

// Readable request status codes
function statusCodeMeaning(statusCode) {
	if (statusCode == 400) return "Bad request.";
	if (statusCode == 404) return "Page not found.";
	if (statusCode == 500 || statusCode == 501) return "Server error, try again later.";
	if (statusCode == 503 || statusCode == 550) return "Connection refused by server, try again later.";
	return "Try again later.";
}

// Readable error output
function outputError(error, response) {
	let status = "Error: " + error;
	return '<span class="devtext">' + status + '</span>';
}

async function getRequest(url) {
	var options = {
		uri: url,
		headers: {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"},
		resolveWithFullResponse: true
	};

	return request(options).then((response) => {
		if (response.statusCode != 200) return outputError("", response.statusCode);
		else return response.body;
	}).catch((error) => {
		if (error.name == "StatusCodeError") return outputError(statusCodeMeaning(error.statusCode));
		else return outputError(error.message);
	});
}

function getLanguage(term) {
	var jaTest = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
	if (jaTest.test(term)) {
		return {
			source : "ja",
			target : "en"
		}
	} else {
		return {
			source : "en",
			target : "ja"
		}
	}
}

//........................................................................................................

var doc = document;

async function dictionarySearch(searchTerm) {
	if (searchTerm == '') return
	var lang = getLanguage(searchTerm);

	var weblioUrl = "http://ejje.weblio.jp/content/" + encodeURI(searchTerm);
	weblioDictionary(weblioUrl);

	//secondaryOutput
	if (lang.source == "ja") {
		var kotobankUrl = "https://kotobank.jp/word/" + encodeURI(searchTerm);
		kotobankDictionary(kotobankUrl);
	} else if (lang.source == "en") {
		var ldoceUrl = "http://www.ldoceonline.com/search/?q=" + encodeURI(searchTerm);
		ldoceDictionary(ldoceUrl);
	}
}

async function corpusSearch(searchTerm) {
	if (searchTerm == '') return

	doc.getElementById("googleOutput").innerHTML = '';
	googleTranslate(searchTerm);

	doc.getElementById("weblioOutput").innerHTML = '';
	doc.getElementById("alcOutput").innerHTML = '';
	doc.getElementById("lingueeOutput").innerHTML = '';

	var weblioUrl = "http://ejje.weblio.jp/sentence/content/" + encodeURI(searchTerm);
	weblioCorpus(weblioUrl);

	var alcUrl = "https://eow.alc.co.jp/search?q=" + encodeURI(searchTerm) + "&pg=1";
	alcCorpus(alcUrl);

	var lang = getLanguage(searchTerm);
	if (lang.source == "en") lang.source = "english";
	if (lang.source == "ja") lang.source = "japanese";
	if (lang.target == "en") lang.target = "english";
	if (lang.target == "ja") lang.target = "japanese";
	var lingueeUrl = "https://www.linguee.com/" + lang.source + "-" + lang.target + "/search?query=" + encodeURI(searchTerm) + "&ajax=1";
	lingueeCorpus(lingueeUrl);
}

//........................................................................................................

async function googleTranslate(searchTerm) {
	var lang = getLanguage(searchTerm);

	// client=gtx refers to the google chrome translation API, allowing undefined header requests and hopefully more quota by default. Does not return valid JSON.
	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + lang.source + "&tl=" + lang.target + "&dt=t&q=" + encodeURI(searchTerm);
	var response = await getRequest(url);
	var result = response.match(/".*?"/)[0].slice(1,-1);
	doc.getElementById("googleOutput").innerHTML = result;
}

//........................................................................................................
// DICTIONARIES
//........................................................................................................

async function weblioDictionary(url) {
	var output = doc.getElementById("weblioDictOutput");
	output.innerHTML = '';

	var response = await getRequest(url);
	var $ = cheerio.load(response);

	var noTermFound = $(".noResultTranslateBox").length;
	if (noTermFound != 0) {
		output.innerHTML += '<span class="devtext">No Term Found</span>';
		return;
	}

	$("script").replaceWith("");
	$(".free-reg-banner").replaceWith("");
	$(".theme-learning-banner").replaceWith("");
	$(".addToSlBtnCntner").replaceWith("");
	$(".sntcA").replaceWith("");
	$(".fa").replaceWith("");
	$(".topic").replaceWith("");
	$(".subMenuTop").replaceWith("");
	$(".subMenu").replaceWith("");
	$(".summaryC").replaceWith("");
	$(".pin-icon-cell").replaceWith("");
	$(".gtm-addUwl-str").replaceWith("");
	$("#addUwl").replaceWith("");
	$("#leadToVocabIndexBtnWrp").replaceWith("");
	$("#leadToSpeakingTestIndexBtnWrp").replaceWith("");
	$(".hideDictWrp").replaceWith("");
	$(".adGH").replaceWith("");
	$(".adsbygoogle").replaceWith("");

	$(".mainBlock").each(function(i, element) {
		var innertext = $(this).text();
		//test if a main block has no content (e.g. was for ads only) and remove it
		var innertext = innertext.replace(/\s+/g, ' ').trim();
		if (innertext == '') {
			$(this).replaceWith('');
		}
	})

	output.innerHTML += $("#main").html();
}

async function kotobankDictionary(url) {
	doc.getElementById("secondaryDictOutput").classList.add('kotobankDict');
	doc.getElementById("secondaryDictOutput").classList.remove('ldoceDictOutput');

	var output = doc.getElementById("secondaryDictOutput");
	output.innerHTML = '';

	var response = await getRequest(url);
	var $ = cheerio.load(response);

	var noTermFound = $(".noRes").length;
	if (noTermFound != 0) {
		output.innerHTML += '<span class="devtext">No Term Found</span>';
		return;
	}

	$("script").replaceWith("");
	$("header").replaceWith("");
	$("#mainFt").replaceWith("");
	$("footer").replaceWith("");

	output.innerHTML += $("body").html();
}

async function ldoceDictionary(url) {
	doc.getElementById("secondaryDictOutput").classList.add('ldoceDictOutput');
	doc.getElementById("secondaryDictOutput").classList.remove('kotobankDict');

	var output = doc.getElementById("secondaryDictOutput");
	output.innerHTML = '';

	var response = await getRequest(url);
	var $ = cheerio.load(response);

	var noTermFound = $(".search_title").text();
	if (noTermFound.startsWith("Sorry, there are no results for")) {
		output.innerHTML += '<span class="devtext">No Term Found</span>';
		return;
	}

	$("script").replaceWith("");
	$(".pagetitle").replaceWith("");

	//Search Page
	var searchPage = $(".page_content").length;
	if (searchPage != 0) {
		output.innerHTML += $(".page_content").html();
		return;
	}
	//Term Page
	var termPage = $(".entry_content").length;
	if (termPage != 0) {
		output.innerHTML += $(".entry_content").html();
	}
}

//........................................................................................................
// CORPORA
//........................................................................................................
var gWeblioUrl = '';
var gAlcUrl = '';

function seeMore() {
	if (gWeblioUrl != '') weblioCorpus(gWeblioUrl);
	if (gAlcUrl != '') alcCorpus(gAlcUrl);
	seeMoreBtnVisibilityCheck();
}
function seeMoreBtnVisibilityCheck() {
	var seeMoreBtn = doc.getElementById("seeMoreBtn");
	if (gWeblioUrl == '' && gAlcUrl == '') seeMoreBtn.style.visibility = 'hidden';
	else seeMoreBtn.style.visibility = 'visible';
}

async function weblioCorpus(url) {
	var output = doc.getElementById("weblioOutput");
	gWeblioUrl = '';

	var response = await getRequest(url);
	var $ = cheerio.load(response);

	var noTermFound = $(".noResultTranslateBox").length;
	if (noTermFound != 0) {
		output.innerHTML += '<span class="devtext">No Term Found</span>';
		return;
	}

	//En pages: En = qotCE | Jp = qotCJ
	//Jp pages: Jp = qotCJJ | En = qotCJE
	var langCheck = $(".qotCE").length;

	$("script").replaceWith("");
	$(".addToSlBtnCntner").replaceWith("");
	$(".sntcA").replaceWith("");
	$(".script").replaceWith("");
	$(".fa").replaceWith("");

	//Find the class qotC, which there are multiple of, each containing a sentence
	$(".qotC").each(function(i, element) {
		if (langCheck != 0) {
			var eng = $(element).find(".qotCE").html();
			var jp = $(element).find(".qotCJ").html();
			output.innerHTML += '<span class="tdSrc">' + eng + '</span>' + '<br />';
			output.innerHTML += '<span class="tdDst">' + jp + '</span>' + '<br />' + '<br />';
		}
		else {
			var eng = $(element).find(".qotCJE").html();
			var jp = $(element).find(".qotCJJ").html();
			output.innerHTML += '<span class="tdSrc">' + jp + '</span>' + '<br />';
			output.innerHTML += '<span class="tdDst">' + eng + '</span>' + '<br />' + '<br />';
		}
	})

	// Get the next page for the 'see more' button
	if ($(".TargetPage").length == 0) {
		seeMoreBtnVisibilityCheck();
		output.innerHTML += '<span class="devtext">End of Results</span>'
		return
	}
	if (!url.match(/\/+\d+$/)) {
		var nextPageNumber = parseInt($(".TargetPage").text()[0]) + 1;
		var newPageUrl = url + "/" + nextPageNumber;
		if ($(".pgntionWrp").length != 0) {
			gWeblioUrl = newPageUrl;
		}
	} else {
		var nextPageNumber = parseInt(url.match(/\d+$/)[0]) + 1;
		var removeCurrentPageNumber = url.replace(/\d+$/, '');
		var newPageUrl = removeCurrentPageNumber + "/" + nextPageNumber;
		if ($(".pgntionWrp").length != 0) {
			gWeblioUrl = newPageUrl;
		}
	}

	seeMoreBtnVisibilityCheck();
}

async function alcCorpus(url) {
	var output = doc.getElementById("alcOutput");
	gAlcUrl = '';

	var response = await getRequest(url);
	var $ = cheerio.load(response);

	var noTermFound = $("#navigation_zero").length;
	if (noTermFound != 0) {
		output.innerHTML += '<span class="devtext">No Term Found</span>';
		return;
	}

	$("script").replaceWith("");
	$(".kana").replaceWith("");
	$(".label").replaceWith("");
	$(".tango").replaceWith("");
	$(".wordclass").replaceWith("");

	$("#resultsList").find("li").each(function(i, element) {
		$(this).find("a").replaceWith(function() {return $(this).contents();})

		var source = $(element).find("h2").html();
		var destination = $(element).find("div").html();

		if (source != null && destination != null) {
			output.innerHTML += '<span class="tdSrc">' + source + '</span>' + '<br />';
			output.innerHTML += '<span class="tdDst">' + destination + '</span>' + '<br />' + '<br />';
		}
	})

	// Get the next page for the 'see more' button
	if ($(".cur").length == 0) {
		seeMoreBtnVisibilityCheck();
		output.innerHTML += '<span class="devtext">End of Results</span>'
		return
	}
	if (!url.match(/pg=+\d$/)) {
		var nextPageNumber = parseInt($(".cur").text()[0]) + 1;
		var newPageUrl = url + "/" + nextPageNumber;
		if ($("#paging").length != 0) {
			gAlcUrl = newPageUrl;
		}
	} else {
		var nextPageNumber = parseInt(url.match(/\d+$/)[0]) + 1;
		var removeCurrentPageNumber = url.replace(/\d+$/, '');
		var newPageUrl = removeCurrentPageNumber + nextPageNumber;
		if ($("#paging").length != 0) {
			gAlcUrl = newPageUrl;
		}
	}

	seeMoreBtnVisibilityCheck();
}

async function lingueeCorpus(url) {
	var output = doc.getElementById("lingueeOutput");

	var response = await getRequest(url);
	var $ = cheerio.load(response);

	var noTermFound = $(".noresults").length;
	if (noTermFound != 0) {
		output.innerHTML += '<span class="devtext">No Term Found</span>';
		return;
	}

	$("script").replaceWith("");
	$(".source_url_spacer").replaceWith("");

	$("#result_table").find("tr").each(function(i, element) {
		//.sentence left
		var source = $(element).find(".left").html();
		//.sentence right2
		var destination = $(element).find(".right2").html();

		if (source != null && destination != null) {
			output.innerHTML += '<span class="tdSrc">' + source + '</span>' + '<br />';
			output.innerHTML += '<span class="tdDst">' + destination + '</span>' + '<br />' + '<br />';
		}
	})

	output.innerHTML += '<span class="devtext">End of Results</span>'
}