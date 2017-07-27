/*#############################################################################
Project: en, extension+notifier for english-translated asian text-based media
Author: dustysys
Contact: dustysys@protonmail.com
Github: https://github.com/dustysys

File: encore.js

Functions defined in this file are used to create, modify and delete objects
of the List-Series-Release model. Application state such as loading and
saving of these objects, as well as data that needs to be stored like
preferences or unhandled web requests, are also defined here.
#############################################################################*/

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
				callback(new_user_prefs);
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
	user_prefs["one_click_uptodate"] = { enabled: false };
	user_prefs["release_update"] = { enabled: true, interval: 15 };
	user_prefs["list_sync"] = { enabled: false, interval: 60 };
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
 * sets the badge text to the number of unread releases
 * @param {List[]} data_lists
 */
function setBadge(data_lists) {
	var num_releases = getTotalNumNewReadingReleases(data_lists);
	if (num_releases > 0) {
		chrome.browserAction.setBadgeText({ text: num_releases.toString() });
		chrome.browserAction.setBadgeBackgroundColor({ color: "#85020e" });
	} else {
		chrome.browserAction.setBadgeText({ text: "" });
	}
}

/**
 * loads data in order to set the badge text
 * @param {function} callback
 */
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
	series.no_published_releases = false;
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
function getNumLists(data_lists) {
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
			var releases = data_list.series_list[i].unread_releases;
			num += getNumUnseenReleases(releases);
		}
	}
	return num;
}

/**
 * gets the number of releases out of a release set the user
 * has not marked as seen
 * @param {Release[]} unread_releases
 * @returns {Number}
 */
function getNumUnseenReleases(unread_releases) {
	var num = 0;
	unread_releases.forEach(function (item) {
		if (!item.marked_seen) num++;
	});
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
		var releases = data_list.series_list[i].unread_releases;
		if (getNumUnseenReleases(releases) > 0) num++;
	}
	return num;
}

/**
 * gets total new releases for series
 * @param {Series} series
 * @returns {Number}
 */
function getNumNewReleasesForSeries(series) {
	return getNumUnseenReleases(series.unread_releases);
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
 * gets list from listset by its id
 * @param {List[]} data_lists
 * @param {string} list_id
 * @returns
 */
function getListById(data_lists, list_id) {
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
 * gets the numeric position of a list amongst its listset
 * @param {List[]} data_lists
 * @param {string} list_id
 * @returns {number}
 */
function getIndexOfListInLists(data_lists, list_id) {
	for (var index = 0; index < data_lists.length; index++) {
		if (data_lists[index].list_id === list_id) {
			return index;
		}
	}
}

/**
 * gets position of a series within a data list
 * @param {List} data_list
 * @param {string} series_id
 * @returns {number}
 */
function getIndexOfSeriesInList(data_list, series_id) {
	var s_list = data_list.series_list;
	for (var index = 0; index < s_list.length; index++) {
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
				series.date_added = (new Date(Date.now())).toISOString();
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

