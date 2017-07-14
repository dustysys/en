/*#############################################################################
Project: en, extension+notifier for english-translated asian text-based media
Author: dustysys
Contact: dustysys@protonmail.com
Github: https://github.com/dustysys

File: encore_mu.js

This file contains the operations for accessing and modifying the local
List-Series-Release model. This includes loading and saving of the data from
local storage, as well as parsing www.mangaupdates.com html pages to get
information to store as data objects. All local creation, editing and deletion
of lists, series and releases is defined in the functions of this file.
#############################################################################*/

/**
 * Enum for MU list names
 */
var ListEnum = {
	READING: 0,
	WISH: 1,
	COMPLETE: 2,
	UNFINISHED: 3,
	ONHOLD: 4
}

/**
 * loads all storage
 * @param {function(Object)} callback
 */
function loadStorage(callback) {
	chrome.storage.local.get(null, function (local_storage) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error("Failed to load storage");
		} else if (!exists(local_storage)) {
			callback("No Storage");
		} else callback(local_storage);
	});
}

/**
 * loads all series-related data
 * @param {function(Data)} callback
 */
function loadData(callback) {
	loadCurrentUserId(function (user_id) {
		var data_id = "data_" + user_id;
		chrome.storage.local.get(data_id, function (local_data) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
			} else if (!exists(local_data)) {
				callback("No Data");
			}
			else callback(local_data[data_id]);
		});
	});
}

/**
 * locally saves all series-related data
 * @param {Data} data
 * @param {function(Data)} callback
 */
function saveData(data, callback) {
	loadCurrentUserId(function (user_id) {
		var data_id = "data_" + user_id;
		var data_obj = {};
		data_obj[data_id] = data;
		chrome.storage.local.set(data_obj, function () {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
			}
			else if (callback) callback(data);
		});
	});
}


/**
 * loads local xhr details
 * @param {string} request_id
 * @param {function(ReqDetails)} callback
 */
function loadRequest(request_id, callback) {
	var req_name = "req_" + request_id;
	chrome.storage.local.get(req_name, function (request_data) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error(request_id);
		}
		else callback(request_data[req_name]);
	});
}

/**
 * saves xhr details locally
 * @param {ReqDetails} details
 * @param {function} callback
 */
function saveRequest(details, callback) {
	var req_name = "req_" + details.requestId;
	details.enTime = Date.now();
	var req_obj = {};
	req_obj[req_name] = details;

	chrome.storage.local.set(req_obj, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error(details);
		}
		else if (callback) callback();
	});
}

/**
 * saves the current session's user id
 * @param {string} user_id
 * @param {function} callback
 */
function saveCurrentUserId(user_id, callback) {
	var current_user_desc = "current_user";
	var user_obj = {};
	user_obj[current_user_desc] = user_id;
	chrome.storage.local.set(user_obj, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error("Error: failed to save user id " + user_id);
		} else if (callback) callback();
	});
}

/**
 * loads the user id of the last saved session
 * @param {function(string} callback
 */
function loadCurrentUserId(callback) {
	var current_user_desc = "current_user";
	chrome.storage.local.get(current_user_desc, function (current_user_data) {
		if (chrome.runtime.lastError) {
			console.error(console.runtime.lastError);
			console.error("Error: no current user id found");
		} else if (!exists(current_user_data)) {
			callback("No User");
		} else {
			var c = current_user_data.current_user;
			callback(current_user_data[current_user_desc]);
		}
	});
}

/**
 * loads a single user preference by name
 * @param {string} pref_desc
 * @param {function} callback
 */
function loadPref(pref_desc, callback) {
	loadAllPrefs(function (user_prefs) {
		callback(user_prefs[pref_desc]);
	});
}

/**
 * saves a single user preference by name
 * @param {string} pref_desc
 * @param {any} pref
 * @param {function} callback
 */
function savePref(pref_desc, pref, callback) {
	loadAllPrefs(function (user_prefs) {
		user_prefs[pref_desc] = pref;
		saveAllPrefs(user_prefs, callback);
	});
}

/**
 * loads all user preferences
 * @param {function(Object)} callback
 */
function loadAllPrefs(callback) {
	var prefs_desc = "user_prefs";
	chrome.storage.local.get(prefs_desc, function (user_prefs) {
		if (chrome.runtime.lastError) {
			console.error(console.runtime.lastError);
			console.error("Error: failed to load user prefs");
		} else if (!exists(user_prefs)) {
			initializePreferences(function (new_user_prefs) {
				callback(new_user_prefs[prefs_desc]);
			});
		} else {
			callback(user_prefs[prefs_desc]);
		}
	});
}

/**
 * saves all user preferences
 * @param {any} prefs
 * @param {function} callback
 */
function saveAllPrefs(prefs, callback) {
	var prefs_desc = "user_prefs";
	var prefs_obj = {};
	prefs_obj[prefs_desc] = prefs;
	chrome.storage.local.set(prefs_obj, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error("Error: failed to save user prefs");
		} else if (callback) callback(prefs);
	});
}

/**
 * creates a default set of preferences. If previous preferences
 * exist they will be overwritten.
 * @param {Object} callback
 */
function initializePreferences(callback) {
	var user_prefs = {};
	user_prefs["scrollbar"] = { enabled: false };
	user_prefs["animations"] = { enabled: true };
	user_prefs["one_click_uptodate"] = { enabled: true };
	user_prefs["release_update"] = { enabled: true, interval: 15 };
	user_prefs["list_sync"] = { enabled: true, interval: 60 };
	user_prefs["notifications"] = { enabled: true };
	saveAllPrefs(user_prefs, callback);
}

/**
 * reads storage to determine if en has been previously run
 * @param {function(boolean)} callback
 */
function isFirstSession(callback) {
	var session_desc = "first_session";
	chrome.storage.local.get(session_desc, function (first_session) {
		if (chrome.runtime.lastError) {
			console.error(console.runtime.lastError);
			console.error("Error: could not determine if this is first session");
		} else if (!exists(first_session)) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/**
 * finalizes first session by setting first session flag
 * @param {function} callback
 */
function finishFirstSession(callback) {
	var session_desc = "first_session";
	var sess_obj = {};
	sess_obj[session_desc] = false;
	chrome.storage.local.set(sess_obj, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error("Error: failed to finalize first session");
		} else if (callback) callback();
	});
}

/**
 * load the most recent release examined from the main MU Releases page
 * @param {function(Release)} callback
 */
function loadLatestReleaseUpdate(callback) {
	var release_desc = "latest_release_update";
	chrome.storage.local.get(release_desc, function (latest_updated_release) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error("Error: failed to load latest release");
		} else if (!exists(latest_updated_release)) {
			callback("No Release");
		} else {
			callback(latest_updated_release[release_desc]);
		}
	});
}

/**
 * save the most recent release examined from the main MU Releases page
 * @param {Release} release
 * @param {function} callback
 */
function saveLatestReleaseUpdate(release, callback) {
	var release_desc = "latest_release_update";
	var release_obj = {};
	release_obj[release_desc] = release;
	chrome.storage.local.set(release_obj, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error("Error: failed to save latest release");
		} else if (callback) callback();
	});
}

/**
 * deletes an xhr's saved details
 * @param {string} request_id
 * @param {function} callback
 */
function deleteRequest(request_id, callback) {
	var req_name = "req_" + request_id;
	chrome.storage.local.remove(req_name, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			console.error(request_id);
		}
		else if (callback) callback();
	});
}

/**
 * clears entire storage space
 * @param {function} callback
 */
function clearAllData(callback) {
	chrome.storage.local.clear(function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		}
		else if (callback) callback();
	});
}

/**
 * find number of instances of substring within string
 * @param {string} string 
 * @param {string} substring
 * @returns {integer}
 */
function instancesOf(string, substring) {
    string += "";
    substring += "";
    if (substring.length <= 0){
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
	if (!isEmpty(a.latest_unread_release)) {
		if (isEmpty(b.latest_unread_release)) {
			return -1;
		}
	} else if (!isEmpty(b.latest_unread_release)){
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
	if (a.toUpperCase() > b.toUpperCase()) return -1;
	else if (a.toUpperCase() < b.toUpperCase()) return 1;
	else return 0;
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
function isEmpty(value){
	if (value == null || value.length === 0) {
		return true;
	} else if (typeof value == 'undefined'){
		return true;
	}
		else {
		for(var key in value) {
			if (value.hasOwnProperty(key))
			return false;
		}
	}
	return true;
}

/**
 * returns whether variable has substance
 * @param {any} value
 * @returns {boolean}
 */
function exists(value){
	return !isEmpty(value);
}

/**
 * defines empty reading list. This is treated separately
 * because it can't be grabbed on the default MyList page,
 * since we know a user will always have on we can just
 * make it ourself.
 */
function createReadingList() {
	var reading_list = {
		list_id: "read",
		list_name: "Reading&nbsp;List",
		list_type: "read",
		series_list: []
	};

	return reading_list;
}

/**
 * add 1 list to listset
 * @param {List[]} data_lists
 * @param {List} new_list
 */
function addList(data_lists, new_list) {
	data_lists.push(new_list);
}

/**
 * adds lists to listset
 * @param {List[]} data_lists
 * @param {List[]} new_lists
 */
function addLists(data_lists, new_lists) {
	for (var i = 0; i < new_lists.length; i++) {
		addList(data_lists, new_lists[i]);
	}
}

/**
 * adds list of series to list
 * @param {List} data_list
 * @param {Series[]} series_list
 */
function addSeriesToList(data_list, series_list) {
	for (var i = 0; i < series_list.length; i++) {
		data_list.series_list.push(series_list[i]);
	}
}

/**
 * sets local MU model volume/chapter using series ID
 * @param {string} volume
 * @param {string} chapter
 * @param {string} series_id
 * @param {function} callback
 */
function setMUVolumeChapterById(volume, chapter,series_id, callback) {
	loadData(function(data){
		var series = getSeriesById(data.lists, series_id);
		setMUVolume(volume, series);
		setMUChapter(chapter, series);
		
		saveData(data, callback);
	});
}

/**
 * sets local MU model volume/chapter
 * @param {string} volume
 * @param {string} chapter
 * @param {Series} series
 */
function setMUVolumeChapter(volume, chapter, series) {
	setMUVolume(volume, series);
	setMUChapter(chapter, series);
}

/**
 * sets local MU model volume
 * @param {string} volume
 * @param {Series} series
 */
function setMUVolume(volume, series) {
	if (typeof volume == 'number') {
		if (volume < 1) volume = 1;
		volume = volume.toString();
	}
	series.last_update_was_manual = true;
	series.mu_user_volume = volume;
}

/**
 * sets local MU model chapter
 * @param {string} chapter
 * @param {Series} series
 */
function setMUChapter(chapter, series) {
	if (typeof chapter == 'number') {
		if (chapter < 1) chapter = 1;
		chapter = chapter.toString();
	}
	series.last_update_was_manual = true;
	series.mu_user_chapter = chapter;
}

function setBadge(data_lists) {
	var num_releases = getTotalNumNewReleases(data_lists);
	if (num_releases > 0) {
		chrome.browserAction.setBadgeText({ text: num_releases.toString() });
		chrome.browserAction.setBadgeBackgroundColor({ color: "#85020e" });
	} else {
		chrome.browserAction.setBadgeText({ text: "" });
	}
}

function updateBadge(callback) {
	loadData(function (data) {
		if (data !== "No Data") {
		setBadge(data.lists);
		}
	});
}

/**
 * sets local series' latest release
 * @param {Series} series
 * @param {Release} release
 */
function insertNewLatestUnreadRelease(series, release) {
	series.unread_releases.push(release);
	series.latest_unread_release = release;
}

/**
 * alias for unread release insertion
 * @param {Release} release
 * @param {Series} series
 */
function addNewRelease(release, series) {
	insertNewLatestUnreadRelease(series, release);
}

/**
 * updates series with any releases that are new
 * @param {Release[]} releases_arr
 * @param {Series} series
 */
function addNewReleases(releases_arr, series) {
	for (var i = 0; i < releases_arr.length; i++) {
		addNewRelease(releases_arr[i], series);
	}
}

/**
 * removes series from listset
 * @param {List[]} data_lists
 * @param {string} series_id
 */
function removeSeriesFromListsById(data_lists, series_id) {
	for (var i = 0; i < data_lists.length; i++) {
		var s_list = data_lists[i].series_list;
		for (var j = 0; j < s_list.length; j++) {
			if (s_list[j].series_id === series_id) {
				s_list.splice(j, 1);
				return;
			}
		}
	}
}

/**
 * removes all series corresponding to series id within given array from local
 * @param {List[]} data_lists
 * @param {string} list_id
 * @param {string[]} series_id_arr
 */
function removeSeriesArrayFromListById(data_lists, list_id, series_id_arr) {
	var list_to_remove_from = getListById(data_lists, list_id);
	for (var i = 0; i < series_id_arr.length; i++) {
		removeSeriesFromListsById([list_to_remove_from], series_id_arr[i]);
	}
}

/**
 * gets number of lists in listset
 * @param {List[]} data_lists
 * @returns {Number}
 */
function getNumLists(data_lists){
	return data_lists.length;
}

/**
 * gets total number of series in entire listset
 * @param {List[]} data_lists
 * @returns {Number}
 */
function getNumTotalSeries(data_lists) {
	var num = 0;
	for (var i = 0; i < data_lists.length; i++) {
		num += getNumSeriesInList(data_lists[i]);
	}
	return num;
}

/**
 * gets number of series in list
 * @param {List} data_list
 * @returns {Number}
 */
function getNumSeriesInList(data_list) {
	return data_list.series_list.length;
}

/**
 * gets total number of new releases for all series in listset
 * @param {List[]} data_lists
 * @returns {Number}
 */
function getTotalNumNewReleases(data_lists) {
	var num = 0;
	for (var i = 0; i < data_lists.length; i++) {
		num += getNumNewReleasesInList(data_lists[i]);
	}
	return num;
}

/**
 * gets total number of new releases for all series in a list
 * @param {List} data_list
 * @returns {Number}
 */
function getNumNewReleasesInList(data_list) {
	var num = 0;
	for (var i = 0; i < data_list.series_list.length; i++) {
		if (exists(data_list.series_list[i].unread_releases)) {
			num += data_list.series_list[i].unread_releases.length;
		}
	}
	return num;
}

/**
 * gets number of series in entire listset with at least 1 new release
 * @param {List[]} data_lists
 * @returns {Number}
 */
function getTotalNumSeriesWithNewReleases(data_lists) {
	var num = 0;
	for (var i = 0; i < data_lists.length; i++) {
		num += getNumSeriesWithNewReleasesInList(data_list[i]);
	}
	return num;
}

/**
 * gets number of series in list which have at least 1 new release
 * @param {List} data_list
 * @returns {Number}
 */
function getNumSeriesWithNewReleasesInList(data_list) {
	var num = 0;
	for (var i = 0; i < data_list.series_list.length; i++) {
		if (exists(data_list.series_list[i].latest_unread_release)) {
			num++;
		}
	}
	return num;
}

/**
 * gets total new releases for series
 * @param {Series} series
 * @returns {Number}
 */
function getNumNewReleasesForSeries(series) {
	return series.unread_releases.length;
}

/**
 * get list by its id
 * @param {List[]} data_lists
 * @param {string} list_id
 * @returns {List}
 */
function getList(data_lists, list_id) {
	for (var i = 0; i < data_lists.length; i++) {
		var suspect_list = data_lists[i];
		if (suspect_list.list_id === list_id) {
			return suspect_list;
		}
	}
}

/**
 * gets list based on MU list count
 * @param {List[]} data_lists
 * @param {number} num
 * @returns {List} corresponding to enum
 */
function getListByEnum(data_lists, num) {
	var list_id = "";
	// MU user lists start at 101
	// 101 = list id user1 112 = user12 etc
	if (num > 100) {
		num -= 100;
		list_id = "user" + num.toString();
	}
	else {
		switch (num) {
			case ListEnum.READING:
				list_id = "read";
				break;
			case ListEnum.WISH:
				list_id = "wish";
				break;
			case ListEnum.COMPLETE:
				list_id = "complete";
				break;
			case ListEnum.UNFINISHED:
				list_id = "unfinished";
				break;
			case ListEnum.ONHOLD:
				list_id = "hold";
				break;
			default:
				console.error("Error: Unknown list id");
				break;
		}
	}
	return getListById(data_lists, list_id);
}

/**
 * gets list from listset by its id
 * @param {List[]} data_lists
 * @param {string} list_id
 * @returns
 */
function getListById(data_lists, list_id){
	for (var i = 0; i < data_lists.length; i++) {
		if (data_lists[i].list_id === list_id) {
			return data_lists[i];
		}
	}
}

/**
 * get subset of a listset by type
 * @param {List[]} data_lists
 * @param {string} list_type
 * @returns {List[]}
 */
function getListsByType(data_lists, list_type) {
	var lists_of_type = [];
	for (var i = 0; i < data_lists.length; i++) {
		if (data_lists[i].list_type === list_type) {
			lists_of_type.push(data_lists[i]);
		}
	}
	return lists_of_type;
}

/**
 * gets position of a series within a data list
 * @param {List} data_list
 * @param {string} series_id
 * @returns
 */
function getIndexOfSeriesInList(data_list, series_id) {
	var s_list = data_list.series_list;
	for (var index = 0; j < s_list.length; index++) {
		if (s_list[index].series_id === series_id) {
			return index;
		}
	}
}

/**
 * gets series from list set by its id
 * @param {List[]} data_lists
 * @param {string} series_id
 * @returns {Series}
 */
function getSeriesById(data_lists, series_id) {
	for (var i = 0; i < data_lists.length; i++) {
		var s_list = data_lists[i].series_list;
		for (var j = 0; j < s_list.length; j++) {
			if (s_list[j].series_id === series_id) {
				return s_list[j];
			}
		}
	}
}

/**
 * gets the default url associated with series
 * @param {string} series_id
 * @returns {string}
 */
function getDefaultLink(series_id) {
	//TODO: add user-specified default link options

	var series_id = series_id;
	return "https://www.mangaupdates.com/series.html?id=" + series_id;
}

/**
 * gets latest published release within series. assumes 'latest' read/unread
 * are valid and therefore should not be used on incoming parsed releases
 * @param {Series} data_series
 * @returns {Release}
 */
function getLatestRelease(data_series) {
	var latest_unread = data_series.latest_unread_release;
	var latest_read = data_series.latest_read_release;
	if (!isEmpty(latest_unread)) {
		return latest_unread;
	} else return latest_read;
}

/**
 * evaluates release1 newer than release2
 * @param {Release} release1
 * @param {Release} release2
 * @returns {boolean}
 */
function releaseIsNewer(release1, release2) {
	return cmp_date(release1.date, release2.date)
}

/**
 * evaluates if releases are unique
 * @param {Release} release1
 * @param {Release} release2
 * @returns {boolean}
 */
function releasesAreSame(release1, release2) {
	var release1_str = release1.groups + release1.volume + release1.chapter + release1.date;
	var release2_str = release2.groups + release2.volume + release2.chapter + release2.date;
	return (release1_str === release2_str);
}

/**
 * evaluates if lists are unique
 * @param {List} list1
 * @param {List} list2
 * @returns {boolean}
 */
function listsAreSame(list1, list2) {
	return (list1.list_id + list1.list_name) === (list2.list_id + list2.list_name);
}

/**
 * checks for List in listset
 * @param {List[]} data_lists
 * @param {List} data_list
 * @returns {boolean}
 */
function hasList(data_lists, data_list) {
	var list_present = false;
	for (var i = 0; i < data_lists.length; i++) {
		if (listsAreSame(data_lists[i], data_list)) {
			list_present = true;
			break;
		}
	}
	return list_present;
}

/**
 * checks for series in List
 * @param {List} data_list
 * @param {string} series_id
 * @returns {boolean}
 */
function hasSeries(data_list, series_id) {
	var series_present = false;
	var s_list = data_list.series_list;
	for (var i = 0; i < s_list.length; i++) {
		if (s_list[i].series_id === series_id) {
			series_present = true;
			break;
		}
	}
	return series_present;
}

/**
 * validates release1 and checks that it is not demonstrably
 * older than release2
 * @param {Release} release1
 * @param {Release} release2
 * @returns
 */
function releaseCouldBeNewer(release1, release2) {
	var could_be_newer = true;
	if (exists(release1)) {
		if (exists(release2)) {
			if (releaseIsNewer(release2, release1) || releasesAreSame(release1, release2)) {
				could_be_newer = false;
			}
		}
	} else {
		console.error("Invalid input release");
	}
	return could_be_newer;
}

/**
 * validates and ensures release is not stale
 * @param {Series} data_series
 * @param {Release} release
 * @returns {boolean}
 */
function releaseIsNew(data_series, release) {
	var release_is_new = true;
	var old_releases = data_series.unread_releases;
	var old_latest_read = data_series.latest_read_release;
	var old_latest_unread = data_series.latest_unread_release;
	if (!releaseCouldBeNewer(release, old_latest_unread)) {
		release_is_new = false;
	} else if (!releaseCouldBeNewer(release, old_latest_read)) {
		release_is_new = false;
	} else if (exists(old_releases)) {
		for (var i = 0; i < old_releases.length; i++) {
			if (!releaseCouldBeNewer(release, old_releases[i])) {
				release_is_new = false;
				break;
			}
		}
	}
	return release_is_new;
}




/**
 * Sends the user a browser notification with release
 * Clicking it sends them to the series' designated url 
 * @param {Release} release
 * @param {Series} series
 */
function notifyOfRelease(release, series) {
	var exists_volume = (release.volume !== "");
	var exists_chapter = (release.chapter !== "");
	var chap_vol = "n/a";
	if (exists_volume && exists_chapter) {
		chap_vol = "v. " + release.volume + " c." + release.chapter;
	}
	else if (exists_chapter) {
		chap_vol = "c. " + release.chapter;
	}
	else if (exists_volume) {
		chap_vol = "v. " + release.volume;
	}

	var messages = [
		{ title: "Series: ", message: release.title },
		{ title: "Group: ", message: release.groups },
		{ title: "Release: ", message: chap_vol }
	];

	var opt = {
		type: "list",
		title: "New manga release",
		message: "New manga release",
		iconUrl: "img/icon128.png",
		items: messages
	};
	var url;
	if (exists(series.user_link)) {
		url = series.user_link;
	} else {
		url = getDefaultLink(series.series_id);
	}

	// TODO: give sufficient delay for firefox or figure out
	// why it isn't working otherwise
	chrome.notifications.create(url, opt, function (notif_id) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		} else {
			console.log("Notification successful!");
		}
	});

}

/**
 * mark a series up-to-date and pushes the change to MU
 * @param {string} series_id
 * @param {function(Data)} callback
 */
function userMarkSeriesUpToDate(series_id, callback) {
	scanSeriesLatestRelease(series_id, function (release) {
		loadData(function (data) {
			var series = getSeriesById(data.lists, series_id);
			series.last_update_was_manual = false;

			if (exists(release)) {
				series.latest_read_release = release;
				if (!isEmpty(series.unread_releases)) {
					series.unread_releases = [];
				}

				if (!isEmpty(series.latest_unread_release)) {
					series.latest_unread_release = {};
				}
				setMUVolumeChapter(release.volume, release.chapter, series);
				pushMUVolumeChapter(series.mu_user_volume, series.mu_user_chapter, series.series_id);
				series.last_update_was_manual = false;
				setBadge(data.lists);
			} else series.no_published_releases = true;
			saveData(data, callback);
		});
	});
}

/**
 * attaches a link provided by the user to the series corresponding to the id
 * @param {string} series_id
 * @param {string} link
 * @param {function} callback
 */
function userSetSeriesLink(series_id, link, callback) {
	loadData(function (data) {
		var series = getSeriesById(data.lists, series_id);
		if (exists(series) && exists(link)) {
			series.user_link = link;
			saveData(data, callback);
		}
	});
}

/**
 * removes user_link property from series corresponding to id
 * @param {string} series_id
 * @param {function} callback
 */
function userClearSeriesLink(series_id, callback) {
	loadData(function (data) {
		var series = getSeriesById(data.lists, series_id);
		if (exists(series)) {
			delete series.user_link;
			saveData(data, callback);
		}
	});
}

/**
 * deletes all series corresponding to ids in given array from lists, then
 * pushes the deletions to MU
 * @param {string} list_src_id
 * @param {string[]} delete_series_id_arr
 * @param {function} callback
 */
function userDeleteSeries(list_src_id, delete_series_id_arr, callback) {
	loadData(function (data) {
		removeSeriesArrayFromListById(data.lists, list_src_id, delete_series_id_arr);
		pushMUSeriesDelete(list_src_id, delete_series_id_arr);
		setBadge(data.lists);
		saveData(data, callback);
	});
}

/**
 * moves all series corresponding to ids in given array from specified list to
 * specified list, then pushes the moves to MU
 * @param {string} list_src_id
 * @param {string} list_dst_id
 * @param {string[]} move_series_id_arr
 * @param {function} callback
 */
function userMoveSeries(list_src_id, list_dst_id, move_series_id_arr, callback) {
	loadData(function (data) {
		moveSeriesArrayListToListById(data.lists, list_src_id, list_dst_id, move_series_id_arr);
		pushMUSeriesMove(list_src_id, list_dst_id, move_series_id_arr);
		saveData(data, callback);
	});
}

/**
 * updates local model with user input and pushes to MU
 * @param {string} series_id
 * @param {string} volume
 * @param {string} chapter
 * @param {function} callback
 */
function userManualUpdateVolumeChapter(series_id, volume, chapter, callback) {
	loadData(function (data) {
		var series = getSeriesById(data.lists, series_id);
		setMUVolumeChapter(volume, chapter, series);
		pushMUVolumeChapter(series.mu_user_volume, series.mu_user_chapter, series.series_id);
		saveData(data, callback);
	});
}

/**
 * moves series from its list in the listset to another list
 * @param {List[]} data_lists
 * @param {List} data_list_new
 * @param {string} series_id
 */
function moveSeriesListToListById(data_lists, data_list_new, series_id) {
	for (var i = 0; i < data_lists.length; i++) {
		var s_list = data_lists[i].series_list;
		for (var j = 0; j < s_list.length; j++) {
			if (s_list[j].series_id === series_id) {
				var series = s_list[j];
				data_list_new.series_list.push(series);
				s_list.splice(j, 1);
				return;
			}
		}
	}
}

/**
 * moves all the series corresponding to the array of series ids from and to the specified lists
 * @param {List[]} data_lists
 * @param {string} src_list_id
 * @param {string} dst_list_id
 * @param {string[]} series_id_arr
 */
function moveSeriesArrayListToListById(data_lists, src_list_id, dst_list_id, series_id_arr) {
	var data_list = getListById(data_lists, src_list_id);
	var data_list_new = getListById(data_lists, dst_list_id);

	for (var i = 0; i < series_id_arr.length; i++) {
		moveSeriesListToListById([data_list], data_list_new, series_id_arr[i]);
	}
}

/**
 * empty list of series into another list
 * @param {List} data_list
 * @param {List} data_list_new
 */
function moveAllSeriesInListToList(data_list, data_list_new) {
	var s_list = data_list.series_list;
	var s_list_new = data_list_new.series_list;
	for (var i = 0; i < s_list.length; i++) {
		var series = s_list[i];
		s_list_new.push(series);
		s_list.splice(i, 1);
		i--;
	}
}

/**
 * delete list from listset
 * @param {List[]} data_lists
 * @param {List} remove_list
 */
function removeList(data_lists, remove_list) {
	for (var i = 0; i < data_lists.length; i++) {
		if (data_lists[i].list_id === remove_list.list_id) {
			data_lists.splice(i, 1);
		}
	}
}

/**
 * scans MU for unsaved user lists and returns in callback
 * @param {List[]} existing_lists
 * @param {function([List])} callback
 */
function scanForNewLists(existing_lists, callback) {
	getMyListPage(function (list_page) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(list_page, "text/html");
		var elm = doc.querySelector('[id="add_series"]');
		var root = elm.previousElementSibling;
		var first_list = 10; // wish list
		var lists_to_add = [];

		// Reading list treated separately because data is not available
		// for it on My Lists page
		var reading_list = createReadingList();
		if (!hasList(existing_lists, reading_list)) {
			lists_to_add.push(reading_list);
		}

		for (var i = first_list; i < root.children.length; i++) {
			var list_elm = root.children[i];
			var link = list_elm.getAttribute("href");
			var list_id = link.substring(link.indexOf("=") + 1);
			var list_name = list_elm.firstElementChild.innerHTML;
			var new_list = {
				list_id: list_id,
				list_name: list_name,
				series_list: []
			};

			if (!hasList(existing_lists, new_list)) {
				lists_to_add.push(new_list);
			}
		}
		// finish list scan by adding types
		pullListTypes(lists_to_add, callback);
	});
}

/**
 * scans all series for specific list
 * @param {List} existing_list
 * @param {function(Series[])} callback
 */
function scanListForNewSeries(existing_list, callback) {
	getListPage(existing_list.list_id, function (list_page) {
		var s_list = [];
		var parser = new DOMParser();
		var doc = parser.parseFromString(list_page, "text/html");
		var rows = doc.getElementsByClassName("lrow");

		for (var i = 0; i < rows.length; i++) {

			var s_url = rows.item(i).children[1].children[0].getAttribute("href");
			var id = s_url.substring(s_url.indexOf("=") + 1);

			if (!hasSeries(existing_list, id)) {
				var s_title = rows.item(i).children[1].children[0].children[0].innerHTML;
				var vol_digit = "";
				var chap_digit = "";
				var date = "";
				if (existing_list.list_type === "read") {
					var volume = rows.item(i).children[2].children[1].children[0].children[0].innerHTML;
					var chapter = rows.item(i).children[2].children[2].children[0].children[0].innerHTML;
					vol_digit = validateDigits(volume);
					chap_digit = validateDigits(chapter);
				}
				else if (existing_list.list_type === "wish" || existing_list.list_type === "complete") {
					date = rows.item(i).children[2].innerHTML;
				}
				else if (existing_list.list_type === "unfinished" || existing_list.list_type === "hold") {
					var vol_chap = rows.item(i).children[2].innerHTML;
					vol_digit = vol_chap.substring(2, vol_chap.indexOf('c.') - 1);
					chap_digit = vol_chap.substring(vol_chap.indexOf('c.') + 2);
				}

				var new_series = {
					series_id: id,
					title: s_title,
					mu_user_volume: vol_digit,
					mu_user_chapter: chap_digit,
					date_added: date,
					tracked: true,
					unread_releases: [],
					last_update_was_manual: true,
					no_published_releases: false
				};

				s_list.push(new_series);
			}
		}

		callback(s_list);
	});
}

/**
 * returns a Series from its MU page
 * @param {string} series_id
 * @param {function(Series)} callback
 */
function scanSeries(series_id, callback) {
	getSeriesInfoPage(series_id, function(series_page){
		var parser = new DOMParser();
		var doc = parser.parseFromString(series_page, "text/html");
		var title_elms = doc.getElementsByClassName("releasestitle tabletitle");
		var title = title_elms[0].innerHTML;

		var series = {
			series_id: series_id,
			title: title,
			mu_user_volume: "1",
			mu_user_chapter: "1",
			date_added: "",
			tracked: true,
			unread_releases: [],
			last_update_was_manual: true,
			no_published_releases: false
		};

		callback(series);
	});
}

/**
 * gets latest release from specific series release page
 * @param {string} series_id
 * @param {function(Release)} callback
 */
function scanSeriesLatestRelease(series_id, callback) {
	getSeriesReleasePage(series_id, function (release_page) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(release_page, "text/html");
		var elm_list = doc.querySelector('[title="Series Info"]');
		if (elm_list) {

			var elm_title = elm_list;
			var elm_date = elm_title.parentElement.previousElementSibling;
			var elm_volume = elm_list.parentElement.nextElementSibling;
			var elm_chapter = elm_volume.nextElementSibling;
			var elm_groups = elm_chapter.nextElementSibling;

			var date_obj = new Date(elm_date.innerHTML);
			var r_date = date_obj.toISOString();
			var r_title = elm_title.innerHTML;
			var r_volume = elm_volume.innerHTML;
			var r_chapter = elm_chapter.innerHTML;
			var r_groups = "";

			for (var j = 0; j < elm_groups.children.length; j++) {
				if (j == 0) r_groups += elm_groups.children[0].innerHTML;
				else {
					r_groups += " & " + elm_groups.children[j].innerHTML;
				}
			}
			var release = {
				date: r_date,
				title: r_title,
				volume: r_volume,
				chapter: r_chapter,
				groups: r_groups
			};
			callback(release);
		}
		else {
			console.log("No releases found!");
			callback();
		}
	});
}

/**
 * scans for all releases from series' release page(unused/unfinished)
 * @param {string} series_id
 */
function scanSeriesLatestReleases(series_id) {
	getSeriesReleasePage(series_id, function(release_page){
		var parser = new DOMParser();
		var doc = parser.parseFromString(release_page, "text/html");
		var elm_list = doc.querySelectorAll('[title="Series Info"]');
		if (elm_list && elm_list.length>0){
			for (var i = 0; i < elm_list.length; i++) {
				
				var elm_title = elm_list[i];
				var elm_date = elm_title.parentElement.previousElementSibling;
				var elm_volume = elm_list[i].parentElement.nextElementSibling;
				var elm_chapter = elm_volume.nextElementSibling;
				var elm_groups = elm_chapter.nextElementSibling;
				
				var date_obj = new Date(elm_date.innerHTML);
				var r_date = date_obj.toISOString();
				var r_title = elm_title.innerHTML;
				var r_volume = elm_volume.innerHTML;
				var r_chapter = elm_chapter.innerHTML;
				var r_groups = "";
				
				for (var j = 0; j < elm_groups.children.length; j++)
				{
					if (j==0) r_groups += elm_groups.children[0].innerHTML;
					else{
						r_groups += " & " + elm_groups.children[j].innerHTML;
					}
				}
				
				
				var release = {
					date:r_date,
					title:r_title,
					volume:r_volume,
					chapter:r_chapter,
					groups:r_groups
				};
					console.log(release);
					
				}
			}
		else {
			console.log("No releases found!");
		}
	});
}

/**
 * scans for series_id:release tuples on new release page
 * @typedef {Object} SeriesReleasePair
 * @param {function(SeriesReleasePair[])} callback
 */
function scanNewReleases(callback) {
	var new_releases_page_num = "1";
	getNewReleasesPage(new_releases_page_num, function (new_releases_page) {
		loadLatestReleaseUpdate(function (latest_release_update) {
			var series_id_release_pairs = [];
			var parser = new DOMParser();
			var doc = parser.parseFromString(new_releases_page, "text/html");
			var elm_date_list = doc.querySelectorAll('[style="display:inline"]');
			if (elm_date_list && elm_date_list.length > 0) {
				for (var i = 0; i < elm_date_list.length; i++) {
					var elm_date = elm_date_list[i].firstElementChild;
					var str_date = elm_date.innerHTML;
					var str_date_sans_day = str_date.substring(str_date.indexOf(",") + 2);
					var str_date_parsed = str_date_sans_day.replace(/(\d+)(st|nd|rd|th)/, "$1");
					var date_obj = new Date(str_date_parsed);
					var r_date = date_obj.toISOString();

					var release_root = elm_date_list[i].nextElementSibling.querySelectorAll('img[src="images/listicons/type0.gif"]');
					if (release_root && release_root.length > 0) {
						for (var j = 0; j < release_root.length; j++) {
							var elm_title = release_root[j].parentElement.nextElementSibling;
							var elm_vol_chap = elm_title.parentElement.nextElementSibling;
							var elm_groups = elm_vol_chap.nextElementSibling;
							var series_link = elm_title.getAttribute("href");
							var series_id = series_link.substring(series_link.indexOf("=") + 1);

							var r_title = elm_title.innerHTML;
							var r_vol_chap = elm_vol_chap.innerHTML;
							var r_volume = "";
							var r_chapter = "";
							var r_groups = "";

							var vol_indicators = instancesOf(elm_vol_chap.innerHTML, "v.", true);
							var chap_indicators = instancesOf(elm_vol_chap.innerHTML, "c.", true);
							if (vol_indicators == 1 && chap_indicators == 0) {
								r_volume = r_vol_chap.substring(3);
							}
							else if (vol_indicators == 0 && chap_indicators == 1) {
								r_chapter = r_vol_chap.substring(3);
							}
							else if (vol_indicators == 1 && chap_indicators == 1) {
								r_volume = r_vol_chap.substring(3, r_vol_chap.indexOf('c.') - 1);
								r_chapter = r_vol_chap.substring(r_vol_chap.indexOf('c.') + 2);
							}

							for (var k = 0; k < elm_groups.children.length; k++) {
								if (k == 0) r_groups += elm_groups.children[0].innerHTML;
								else {
									r_groups += " & " + elm_groups.children[k].innerHTML;
								}
							}

							var release = {
								date: r_date,
								title: r_title,
								volume: r_volume,
								chapter: r_chapter,
								groups: r_groups
							};

							if (i === 0 && j === 0 && exists(release)) {
								saveLatestReleaseUpdate(release);
							}

							if (latest_release_update && latest_release_update !== "No Release") {
								if (releasesAreSame(latest_release_update, release)) {
									console.log("Checked up to latest release!");
									// break out of the loops:
									i = elm_date_list.length;
									j = release_root.length;
								} else {
									series_id_release_pairs.push([series_id, release]);
								}
							} else {
								series_id_release_pairs.push([series_id, release]);
							}
						}
					}
				}
			}
			callback(series_id_release_pairs);
		});
	});
}

/**
 * gets users MU id
 * @param {function(string)} callback
 */
function scanLoggedInUserId(callback) {
	getMembersPage(function (members_page) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(members_page, "text/html");
		var login_box = doc.getElementById("login_box_padding");
		var user_page_link = login_box.children[0].getAttribute("href");
		if (exists(user_page_link)) {
			var user_id = user_page_link.substring(user_page_link.indexOf("=") + 1);
			callback(user_id);
		} else callback("No User");
	});
}

/**
 * gives lists types based on scanned icon enum
 * @param {List[]} data_lists
 * @param {function(List)} callback
 */
function pullListTypes(data_lists, callback) {
	var lists_typed_count = 0;
	var typed_lists = [];
	if (data_lists.length > 0) {
		data_lists.forEach(function (item, index, array) {
			getListPage(item.list_id, function (icon_page) {

				var icon_parser = new DOMParser();
				var icon_doc = icon_parser.parseFromString(icon_page, "text/html");
				var icon_elm = icon_doc.querySelector('img[alt="icon"]');
				var icon_link = icon_elm.getAttribute("src");
				var icon_type = "";
				switch (icon_link) {
					default:
						icon_type = "read"; break;
					case "images/listicons/big/icon1.gif":
						icon_type = "wish"; break;
					case "images/listicons/big/icon2.gif":
						icon_type = "complete"; break;
					case "images/listicons/big/icon3.gif":
						icon_type = "unfinished"; break;
					case "images/listicons/big/icon4.gif":
						icon_type = "hold"; break;
				}
				item.list_type = icon_type;
				typed_lists.push(item);
				lists_typed_count++;

				if (lists_typed_count === array.length) {
					callback(typed_lists);
				}
			});
		});
	} else callback(data_lists);
}

/**
 * scans MU for and adds any unsaved lists to a listset
 * @param {List[]} data_lists
 * @param {function} callback
 */
function pullLists(data_lists, callback) {
	scanForNewLists(data_lists, function (new_lists) {
		addLists(data_lists, new_lists);
		callback();
	});
}

// TODO: POST favorable pull options to MU, then POST old options
// for example, priority mode on will break the Series[] pull
function primeListForPull() {
}

/**
 * pulls data series for each MU list
 * @param {List[]} data_lists
 * @param {function} callback
 */
function pullSeriesInLists(data_lists, callback) {
	var lists_pulled = 0;
	if (data_lists.length > 0) {
		data_lists.forEach(function (item, index, array) {
			scanListForNewSeries(item, function (series_list) {
				addSeriesToList(item, series_list);
				lists_pulled++;
				if (lists_pulled === array.length) {
					callback();
				}
			});
		});
	} else callback();

}

/**
 * pulls a specified series to a list
 * @param {List} data_list
 * @param {string} series_id
 * @param {function} callback
 */
function pullSeriesToListById(data_list, series_id, callback) {
	scanSeries(series_id, function (series) {
		data_list.series_list.push(series);
		if (callback) callback();
	});
}

/**
 * pulls specified series' latest release
 * @param {Series} series
 */
function pullSeriesLatestRelease(data_series) {
	scanSeriesLatestRelease(data_series.series_id, function (release) {
		
	});
}

/**
 * updates series from any read lists in listset
 * with any new entries from new releases page
 * @param {List[]} data_lists
 * @param {function} callback
 */
function pullNewReleases(data_lists, callback) {
	scanNewReleases(function (series_id_release_pairs) {
		for (var i = 0; i < series_id_release_pairs.length; i++) {
			var read_lists = getListsByType(data_lists, "read");
			var id = series_id_release_pairs[i][0];
			var release = series_id_release_pairs[i][1];
			var series = getSeriesById(read_lists, id);

			if (exists(series) && releaseIsNew(series, release)) {
				addNewRelease(release, series);
				notifyOfRelease(release, series);
			}
		}
		setBadge(data_lists);
		callback();
	});
}

/**
 * gets the id of both the currently logged into MU user and the
 * user id of the previous instance of en
 * @param {function(string)} callback
 */
function pullUserSessionInfo(callback) {
	loadCurrentUserId(function (current_user_id) {
		scanLoggedInUserId(function (logged_in_user_id) {
			callback(current_user_id, logged_in_user_id);
		});
	});
}

/**
 * pulls the entire collection of lists and series from MU
 * @param {function} callback
 */
function pullAllData(callback){
	loadData(function(data){		
		if (data === "No Data"){
				console.log("No data stored, populating lists");
				data = { lists:[] };
		}

		pullLists(data.lists, function(){
			pullSeriesInLists(data.lists, function(){
				saveData(data, function () {
					if (callback) callback();
				});
			});
		});
	});
}

/**
 * checks for new releases for all series in all lists
 */
function updateLists(){
	loadData(function(data){
		if (data === "No Data") {
			console.log("Error: No data to update");
		} else {
			pullNewReleases(data.lists, function () {
				saveData(data);
			});
		}
	});		
}

/**
 * creates a new session based on logged in user and downloads
 * all data
 * @param {string} user_id
 * @param {function} callback
 */
function initializeNewSession(user_id, callback) {
	saveCurrentUserId(user_id, function () {
		pullAllData(function () {
			callback();
		});
	});
}