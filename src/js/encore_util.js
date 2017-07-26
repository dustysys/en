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
 * 1st priority: new releases>no releases
 * 2nd priority: alphabetical
 * @param {Series} a
 * @param {Series} b
 * @returns {boolean}
 */
function cmpReleaseAlphabetical(a, b) {
	var a_latest = a.latest_unread_release;
	var b_latest = b.latest_unread_release;
	if (!isEmpty(a_latest) && !a_latest.marked_seen) {
		if (isEmpty(b_latest)) {
			return -1;
		}
	} else if (!isEmpty(b_latest) && !b_latest.marked_seen) {
		return 1;
	}

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
	if (value == null || value.length === 0) {
		return true;
	} else if (typeof value == 'undefined') {
		return true;
	}
	else {
		for (var key in value) {
			if (value.hasOwnProperty(key))
				return false;
		}
	}
	return true;
}

/**
 * this is supposed to be a lazy typechecker but it fails for things
 * such as numbers or DOM elements.
 * TODO: replace all instances used to check type with a logical alternative
 * @param {any} value
 * @returns {boolean}
 */
function exists(value) {
	return !isEmpty(value);
}