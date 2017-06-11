// For http requests - //https://github.com/request/request
var request = require('request');
var requestOptions = {headers: {'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"}};
// For jquery-like node.js - //https://cheerio.js.org/
var cheerio = require('cheerio');

// Readable status codes
function statusCodeMeaning(statusCode) {
	if (statusCode == 400) {
		return "Bad request."
	}
	if (statusCode == 404) {
		return "Page not found."
	}
	if (statusCode == 500 || statusCode == 501) {
		return "Server error, try again later."
	}
	if (statusCode == 503 || statusCode == 550) {
		return "Connection refused by server, try again later."
	}
	return "Try again later."
}

// Readable error output
function outputError(error, response) {
	let status = error || 'Error: ' + statusCodeMeaning(response.statusCode);
	return '<span class="devtext">' + status + '</span>';
}

// Thanks to https://stackoverflow.com/a/23303587/1679669
// Fix broken chains for SSL Certificates by adding their authority to the trust
var fs = require('fs');
var path = require('path');
var https = require('https'), cas;
require('ssl-root-cas').inject();
var cas = https.globalAgent.options.ca;
// ALC.co.jp
cas.push(fs.readFileSync(path.join(__dirname, 'ssl', 'GlobalSignOrganizationValidationCA-SHA256-G2.crt')));

//........................................................................................................

var doc = document;

function webscrapeformsearch(inputItem) {
	var inputItem = inputItem || doc.getElementById("webscrapeform").elements["webscrapeformterm"].value;
	if (inputItem == '') {
		return
	}
	
	if (/[a-zA-Z]/.test(inputItem)) {
		var sourceLang = "english";
		var targetLang = "japanese";
	} else {
		var sourceLang = "japanese";
		var targetLang = "english";
	}
	
	//Dictionary Search
	var searchType = doc.getElementById("webscrapeform").elements["searchType"].value;
	if (searchType == 'dictionary') {
		var weblioUrl = "http://ejje.weblio.jp/content/" + encodeURI(inputItem);
		weblioDictionary(weblioUrl);
		
		//secondaryOutput
		if (sourceLang == "japanese") {
			var kotobankUrl = "https://kotobank.jp/word/" + encodeURI(inputItem);
			kotobankDictionary(kotobankUrl);
		} else if (sourceLang == "english") {
			var ldoceUrl = "http://www.ldoceonline.com/search/?q=" + encodeURI(inputItem);
			ldoceDictionary(ldoceUrl);
		}
		
		return
	}
	
	doc.getElementById("googleOutput").innerHTML = '';
	googleTranslate(inputItem);
	
	// Corpora Search
	doc.getElementById("weblioOutput").innerHTML = '';
	doc.getElementById("alcOutput").innerHTML = '';
	doc.getElementById("lingueeOutput").innerHTML = '';
	
	var weblioUrl = "http://ejje.weblio.jp/sentence/content/" + encodeURI(inputItem);
	weblioCorpus(weblioUrl);
	
	var alcUrl = "https://eow.alc.co.jp/search?q=" + encodeURI(inputItem) + "&pg=1";
	alcCorpus(alcUrl);
	
	var lingueeUrl = "https://www.linguee.com/" + sourceLang + "-" + targetLang + "/search?query=" + encodeURI(inputItem) + "&ajax=1";
	lingueeCorpus(lingueeUrl);
}

//........................................................................................................

function googleTranslate(inputItem) {
	if (/[a-zA-Z]/.test(inputItem)) {
		var sourceLang = "en";
		var targetLang = "ja";
	} else {
		var sourceLang = "ja";
		var targetLang = "en";
	}
	
	// client=gtx refers to the google chrome translation API, allowing undefined header requests and hopefully more quota by default. Does not return valid JSON.
	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(inputItem);

	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var result = html.match(/".*?"/)[0].slice(1,-1);
			doc.getElementById("googleOutput").innerHTML = result;
		} else {
			doc.getElementById("googleOutput").innerHTML = output.innerHTML += outputError(error, response);
		}
	})
}

//........................................................................................................
// DICTIONARIES
//........................................................................................................

function weblioDictionary(url) {
	var output = doc.getElementById("weblioDictOutput");
	output.innerHTML = '';
	
	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			
			var noTermFound = $(".noResultTranslateBox").length;
			if (noTermFound != 0) {
				output.innerHTML += '<span class="devtext">No Term Found</span>';
				return;
			}
			
			$("script").replaceWith("");
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
		} else {
			output.innerHTML += outputError(error, response);
		}
	});
}

function kotobankDictionary(url) {
	doc.getElementById("secondaryDictOutput").classList.add('kotobankDict');
	doc.getElementById("secondaryDictOutput").classList.remove('ldoceDictOutput');
	
	var output = doc.getElementById("secondaryDictOutput");
	output.innerHTML = '';
	
	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			
			var noTermFound = $(".noRes").length;
			if (noTermFound != 0) {
				output.innerHTML += '<span class="devtext">No Term Found</span>';
				return;
			}
			
			$("header").replaceWith("");
			$("#mainFt").replaceWith("");
			$("footer").replaceWith("");
			$("script").replaceWith("");

			output.innerHTML += $("body").html();
			
		} else {
			output.innerHTML += outputError(error, response);
		}
	});
	
}

function ldoceDictionary(url) {
	doc.getElementById("secondaryDictOutput").classList.add('ldoceDictOutput');
	doc.getElementById("secondaryDictOutput").classList.remove('kotobankDict');
	
	var output = doc.getElementById("secondaryDictOutput");
	output.innerHTML = '';
	
	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			
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
			
		} else {
			output.innerHTML += outputError(error, response);
		}
	});
}

//........................................................................................................
// CORPORA
//........................................................................................................
var gWeblioUrl = '';
var gAlcUrl = '';

function seeMore () {
	if (gWeblioUrl != '') {
		weblioCorpus(gWeblioUrl);
	}
	if (gAlcUrl != '') {
		alcCorpus(gAlcUrl);
	}
	seeMoreBtnVisibilityCheck();
}

function seeMoreBtnVisibilityCheck() {
	var seeMoreBtn = doc.getElementById("seeMoreBtn");
	if (gWeblioUrl == '' && gAlcUrl == '') {
		seeMoreBtn.style.visibility = 'hidden';
	} else {
		seeMoreBtn.style.visibility = 'visible';
	}
}

function weblioCorpus(url) {
	var output = doc.getElementById("weblioOutput");
	gWeblioUrl = '';
	
	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			
			var noTermFound = $(".noResultTranslateBox").length;
			if (noTermFound != 0) {
				output.innerHTML += '<span class="devtext">No Term Found</span>';
				return;
			}
			
			//En pages: En = qotCE | Jp = qotCJ
			//Jp pages: Jp = qotCJJ | En = qotCJE
			var langCheck = $(".qotCE").length;
			
			$(".addToSlBtnCntner").replaceWith("");
			$(".sntcA").replaceWith("");
			$(".script").replaceWith("");
			$(".fa").replaceWith("");
			$("script").replaceWith("");
			
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
		} else {
			output.innerHTML += outputError(error, response);
		}
	});
}

function alcCorpus(url) {
	var output = doc.getElementById("alcOutput");
	gAlcUrl = '';
	
	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			
			var noTermFound = $("#navigation_zero").length;
			if (noTermFound != 0) {
				output.innerHTML += '<span class="devtext">No Term Found</span>';
				return;
			}
			
			$(".kana").replaceWith("");
			$(".label").replaceWith("");
			$(".tango").replaceWith("");
			$(".wordclass").replaceWith("");
			$("script").replaceWith("");
			
			
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
		} else {
			output.innerHTML += outputError(error, response);
		}
	});
}

function lingueeCorpus(url) {
	var output = doc.getElementById("lingueeOutput");
	
	request(url, requestOptions, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			
			var noTermFound = $(".noresults").length;
			if (noTermFound != 0) {
				output.innerHTML += '<span class="devtext">No Term Found</span>';
				return;
			}
			
			$(".source_url_spacer").replaceWith("");
			$("script").replaceWith("");
			
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
		} else {
			output.innerHTML += outputError(error, response);
		}
	});
}