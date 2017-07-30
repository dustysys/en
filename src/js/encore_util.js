/*#############################################################################
File: encore_util.js

General purpose functions which could be useful anywhere are defined here.
#############################################################################*/


/**
 * find number of instances of substring within string
 * @param {string} string 
 * @param {string} substring
 * @returns {integer}
 */
function instancesOf(string, substring) {
	string += "";
	substring += "";
	if (substring.length <= 0) {
		return (string.length + 1);
	}
	var instances = 0;
	var index = 0;

	while (true) {
		index = string.indexOf(substring, index);
		if (index >= 0) {
			instances++;
			index++;
		} else break;
	}
	return instances;
}

/**
 * 1st priority: new releases AND ALSO not seen > no releases 
 * 2nd priority: alphabetical
 * @param {Series} a
 * @param {Series} b
 * @returns {boolean}
 */
function cmpReleaseUpdateOrder(a, b) {
	var a_latest = a.latest_unread_release;
	var b_latest = b.latest_unread_release;
	var a_exists = exists(a_latest);
	var b_exists = exists(b_latest);
	var a_seen = a_exists ? a_latest.marked_seen : null;
	var b_seen = b_exists ? b_latest.marked_seen : null;

	if (!a_exists && !b_exists) return cmpReleaseAlphabetical(a, b);
	if (a_exists && b_exists) {
		if (!a_seen && b_seen) return -1;
		if (a_seen && !b_seen) return 1;
		else return cmpReleaseAlphabetical(a, b);
	}
	if (!a_exists && b_exists) {
		if (!b_seen) return 1;
		else return cmpReleaseAlphabetical(a, b);
	}
	if (a_exists && !b_exists) {
		if (!a_seen) return -1;
		else return cmpReleaseAlphabetical(a, b);
	}
}

function cmpReleaseAlphabetical(a, b) {
	if (a.title === b.title) return 0;
	else if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
	else return 1;
}

/**
 * plain alphabetical comparison
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function cmpAlphabetical(a, b) {
	if (a.toUpperCase() > b.toUpperCase()) return 1;
	else if (a.toUpperCase() < b.toUpperCase()) return -1;
	else return 0;
}

function cmpListAlphabetical(a, b) {
	return cmpAlphabetical(a.list_name, b.list_name);
}

/**
 * evaluates date1 newer than date 2
 * @param {string} date_str1
 * @param {string} date_str2
 * @returns {boolean}
 */
function cmp_date(date_str1, date_str2) {
	var date1 = new Date(date_str1);
	var date2 = new Date(date_str2);

	return (date1.getTime() > date2.getTime());
}

/**
 * remove non-digit characters from string
 * @param {string} input string to have digits removed
 * @returns {string} with only digits
 */
function validateDigits(input) {
	return input.replace(/\D/g, '');
}

/**
 * checks object for presence of any content
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) {
	if (value === null || typeof value === 'undefined') {
		return true;
	} else if (value.length === 0) {
		return true;
	} else if (typeof value === 'number') {
		return false;
	} else if (value instanceof Element) {
		return false;
	} else if (Object.keys(value).length === 0) {
		return true;
	} else return false;
}

/**
 * alias for !isEmpty()
 * TODO: replace all instances used to check type with a logical alternative
 * @param {any} value
 * @returns {boolean}
 */
function exists(value) {
	return !isEmpty(value);
}