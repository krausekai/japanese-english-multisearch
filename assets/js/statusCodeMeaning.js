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