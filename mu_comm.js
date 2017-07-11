/*#############################################################################
File: mu_comm.js

Functions in this file create/receive/process all XHR XMLHttpRequests from and
to www.mangaupdates.com. Essentially it is a reverse engineering of the site's
My List feature, syncing user actions in the popup and those made on MU with
both the remote MU lists and the locally stored list model.
#############################################################################*/

/**
 * generic GET function, returns requested page
 * @param {string} url
 * @param {function(string)} callback
 */
function sendGETRequest(url, callback) {
    var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.onreadystatechange = (function() {
          if (req.readyState == 4 && req.status == 200) {
			  if (callback) callback(req.responseText);
            }
        });
      req.send();
}

/**
 * generic POST function, returns page response
 * @param {string} url
 * @param {Object} form_data
 * @param {function(string)} callback
 */
function sendPOSTRequest(url, form_data, callback) {
	var req = new XMLHttpRequest();
	req.open("POST", url, true);
	req.onreadystatechange = (function () {
		if (req.readyState == 4 && req.status == 200) {
			if (callback) callback(req.responseText);
		}
	});
	req.send(form_data);
}

/**
 * pushes local change to series volume/chapter to MU
 * @param {string} volume
 * @param {string} chapter
 * @param {string} series_id
 */
function pushMUVolumeChapter(volume, chapter, series_id){
	var link = "https://www.mangaupdates.com/ajax/chap_update.php?";
	var s = "s="+series_id+"&";
	var set_v = "set_v="+volume+"&";
	var set_c = "set_c="+chapter+"&";
	var cache_j = "cache_j="+ Math.floor(Math.random()*100000000) + "," + Math.floor(Math.random()*100000000) + "," + Math.floor(Math.random()*100000000);
	sendGETRequest(link + s + set_v + set_c + cache_j);
}

/**
 * pushes local series move from list to list to MU
 * @param {string} src_list_id
 * @param {string} dst_list_id
 * @param {string[]} series_id_arr
 */
function pushMUSeriesMove(src_list_id, dst_list_id, series_id_arr) {
	var url = "https://www.mangaupdates.com/mylist.html";
	var form_data = new FormData();

	for (var i = 0; i < series_id_arr.length; i++) {
		var series_str = "DELETE[" + series_id_arr[i] + "]";
		form_data.append(series_str, "1");
	}

	form_data.append("act", "update");
	form_data.append("list", src_list_id);
	form_data.append("moveto", dst_list_id);

	sendPOSTRequest(url, form_data);
}

/**
 * pushes local series deletion to MU
 * @param {string} src_list_id
 * @param {string[]} series_id_arr
 */
function pushMUSeriesDelete(src_list_id, series_id_arr) {
	var url = "https://www.mangaupdates.com/mylist.html";
	var form_data = new FormData();
	for (var i = 0; i < series_id_arr.length; i++) {
		var series_str = "DELETE[" + series_id_arr[i] + "]";
		form_data.append(series_str, "1");
	}

	form_data.append("act", "update");
	form_data.append("deleteSubmit", "Delete Selected"),
	form_data.append("list", src_list_id);
	form_data.append("moveto", "---");

	sendPOSTRequest(url, form_data);
}

/**
 * gets the page showing releases for a specific series
 * @param {string} series_id
 * @param {function(string)} callback
 */
function getSeriesReleasePage(series_id, callback){
	var url = "https://www.mangaupdates.com/releases.html?search=" + series_id + "&stype=series";
	sendGETRequest(url, callback);
}

/**
 * gets the default MU user list page
 * @param {function(string)} callback
 */
function getMyListPage(callback) {
	sendGETRequest("https://www.mangaupdates.com/mylist.html", callback);
}

/**
 * gets a specific MU series list page
 * @param {string} list_id
 * @param {functiong(string)} callback
 */
function getListPage(list_id, callback) {
	var url = "https://www.mangaupdates.com/mylist.html?list=" + list_id;
	sendGETRequest(url, callback);
}

/**
 * gets MU members page. there's not a lot of data so it's simple
 * to grab the user id from here
 * @param {function(string)} callback
 */
function getMembersPage(callback) {
	var url = "https://www.mangaupdates.com/members.html";
	sendGETRequest(url, callback);
}

/**
 * gets the main page for a series
 * @param {string} series_id
 * @param {function(string)} callback
 */
function getSeriesInfoPage(series_id, callback){
	var url = "https://www.mangaupdates.com/series.html?id=" + series_id;
	sendGETRequest(url, callback);
}

/**
 * gets the new releases page specified
 * @param {string} page_num
 * @param {function(string)} callback
 */
function getNewReleasesPage(page_num, callback) {
	var url = "https://www.mangaupdates.com/releases.html";
	if (parseInt(page_num) > 1) {
		url += "?page=" + page_num + "&";
	}
	sendGETRequest(url, callback);
}

/**
 * gets paramaters from url
 * @param url
 * @param param_name
 * @returns {null}
 */
function getUrlParam(url, param_name) {
	var query = url.substring(url.indexOf('?') + 1);
	var params = query.split('&');
	for (var i = 0; i < params.length; i++) {
		var param = params[i].split('=');
		if (param.length > 1) {
			if (param[0] == param_name) {
				return param[1];
			}
		}
	}
	return null;
}

/**
 * determines function of MU GET request
 * @param {ReqDetails} complete_details
 * @returns {string} comm_type
 */
function parseMUGET(complete_details) {
	var comm_type = "N/A";
	var url = complete_details.url;
	var url_body = url.substring(0, url.indexOf('?'));
	if (url_body === "https://www.mangaupdates.com/ajax/chap_update.php") {
		if (getUrlParam(url, "inc_c")) {
			comm_type = "INCREMENT_CHAPTER";
		} else if (getUrlParam(url, "inc_v")) {
			comm_type = "INCREMENT_VOLUME";
		} else if (getUrlParam(url, "set_c") && getUrlParam(url, "set_v")) {
			comm_type = "SET_VOLCHAP";
		} else if (getUrlParam(url, "reset_c")) {
			comm_type = "RESET_CHAPTER";
		}
	}
	else if (url_body === ("https://www.mangaupdates.com/ajax/list_update.php")) {
		if (getUrlParam(url, "r")) {
			comm_type = "REMOVE_SERIES";
		} else if (getUrlParam(url, "l")) {
			comm_type = "MOVE_SERIES";
		}
	}

	return comm_type;
}

/**
 * determines function of MU POST request
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 */
function parseMUPOST(request_details, complete_details) {
	var comm_type = "N/A";
	var form_data = request_details.requestBody.formData;

	if (exists(form_data.act) && exists(form_data.moveto)) {
		if (form_data.moveto[0] === "---") {
			comm_type = "MULTI_REMOVE_SERIES";
		} else if (form_data.act[0] === "update") {
			comm_type = "MULTI_MOVE_SERIES";
		}
	} else if (exists(form_data.listAction)) {
		if (form_data.listAction[0] === "create") {
			comm_type = "CREATE_LISTS";
		} else if (form_data.listAction[0] === "update") {
			comm_type = "UPDATE_LISTS";
		}
	}

	return comm_type;
}

/**
 * determines the nature of the MU request
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 * @returns {string}
 */
function parseMUComm(request_details, complete_details){
	var method = request_details.method;
	var comm_type = "";
	if (method === "GET") {
		comm_type = parseMUGET(complete_details);
	}
	else if (method === "POST") {
		comm_type = parseMUPOST(request_details, complete_details);
	}

	return comm_type;
}

/**
 * sorts out MU requests and calls the local equivalent to sync state
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 */
function handleMUComm(request_details, complete_details) {
	var comm_type = parseMUComm(request_details, complete_details);
	var url = complete_details.url;

	if (complete_details.statusCode === 200 && comm_type !== "N/A") {
		loadData(function (data) {
			function finishUp() {
				saveData(data, function() {
					deleteRequest(complete_details.requestId);
				});
			}
			switch (comm_type) {
				case "INCREMENT_CHAPTER":
					MUComm_IncrementChapter(url, finishUp, data.lists);
					break;
				case "INCREMENT_VOLUME":
					MUComm_IncrementVolume(url, finishUp, data.lists);
					break;
				case "SET_VOLCHAP":
					MUComm_SetVolumeChapter(url, finishUp, data.lists);
					break;
				case "RESET_CHAPTER":
					MUComm_ResetChapter(url, finishUp, data.lists);
					break;
				case "REMOVE_SERIES":
					MUComm_RemoveSeries(url, finishUp, data.lists);
					break;
				case "MOVE_SERIES":
					MUComm_MoveSeries(url, finishUp, data.lists);
					break;
				case "MULTI_MOVE_SERIES":
					MUComm_MultiMoveSeries(request_details, complete_details, finishUp, data.lists);
					break;
				case "MULTI_REMOVE_SERIES":
					MUComm_MultiRemoveSeries(request_details, complete_details, finishUp, data.lists);
					break;
				case "CREATE_LISTS":
					MUComm_CreateLists(request_details, complete_details, finishUp, data.lists);
					break;
				case "UPDATE_LISTS":
					MUComm_UpdateLists(request_details, complete_details, finishUp, data.lists);
					break;
				case "N/A":
					callback();
					break;
				default:
					console.error("Error: unknown MU comm");
					break;
			}
		});
	}
}

/**
 * sync MU chapter increment to local
 * @param {string} url
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_IncrementChapter(url, callback, data_lists) {
	var series_id = getUrlParam(url, "s");
	var series = getSeriesById(data_lists, series_id);
	var chapter = parseInt(series.mu_user_chapter);
	var inc_val = parseInt(getUrlParam(url, "inc_c"));

	if (exists(series)) setMUChapter(chapter + inc_val, series);
	callback();
}
/**
 * sync MU volume increment to local
 * @param {string} url
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_IncrementVolume(url, callback, data_lists) {
	var series_id = getUrlParam(url, "s");
	var series = getSeriesById(data_lists, series_id);
	var volume = parseInt(series.mu_user_volume);
	var inc_val = parseInt(getUrlParam(url, "inc_v"));

	if (exists(series)) setMUVolume(volume + inc_val, series);
	callback();
}

/**
 * sync volume & chapter change to local 
 * @param {string} url
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_SetVolumeChapter(url, callback, data_lists) {
	var series_id = getUrlParam(url, "s");
	var series = getSeriesById(data_lists, series_id);
	var chapter = parseInt(getUrlParam(url, "set_c"));
	var volume = parseInt(getUrlParam(url, "set_v"));

	if (exists(series)) {
		setMUVolumeChapter(volume, chapter, series);
	}
	callback();
}

/**
 * sync chapter reset to local
 * @param {string} url
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_ResetChapter(url, callback, data_lists) {
	var series_id = getUrlParam(url, "s");
	var series = getSeriesById(data_lists, series_id);

	if (exists(series)) setMUChapter("1", series);
	callback();
}

/**
 * sync series removal to local
 * @param {string} url
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_RemoveSeries(url, callback, data_lists) {
	var series_id = getUrlParam(url, "s", data_lists);
	var remove = getUrlParam(url, "r");
	if (parseInt(remove) == 1) {
		removeSeriesFromListsById(data_lists, series_id);
	}
	callback();
}

/**
 * sync series movement list to list to local
 * @param url
 * @param callback
 * @param data_lists
 */
function MUComm_MoveSeries(url, callback, data_lists) {
	var series_id = getUrlParam(url, "s");
	var series = getSeriesById(data_lists, series_id);
	var list_num = parseInt(getUrlParam(url, "l"));
	var list_new = getListByEnum(data_lists, list_num); 

	if (!exists(series)) {
		pullSeriesToListById(list_new, series_id, callback);
	} else {
		moveSeriesListToListById(data_lists, list_new, series_id);
		callback();
	}
}

/**
 * sync multiple series movement list to list to local
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_MultiMoveSeries(request_details, complete_details, callback, data_lists){
	var form_data = request_details.requestBody.formData;
	var form_fields = Object.keys(form_data);

	for (var i = 0; i < form_fields.length; i++) {
		if (form_fields[i].includes("DELETE[")) {
			var series_id = form_fields[i].substring(7, form_fields[i].length - 1);
			var list_new = getListById(data_lists, form_data.moveto[0]);
			moveSeriesListToListById(data_lists, list_new, series_id);
		}
	}
	callback();
}

/**
 * sync removal of multiple series from list to local
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_MultiRemoveSeries(request_details, complete_details, callback, data_lists) {
	var form_data = request_details.requestBody.formData;
	var form_fields = Object.keys(form_data);

	for (var i = 0; i < form_fields.length; i++) {
		if (form_fields[i].includes("DELETE[")) {
			var series_id = form_fields[i].substring(7, form_fields[i].length - 1);
			removeSeriesFromListsById(data_lists, series_id);
		}
	}
	callback();
}

/**
 * sync new list created
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_CreateLists(request_details, complete_details, callback, data_lists){
	// better just to check than compare to local user lists which may be stale
	pullLists(data_lists, callback);
}

/**
 * sync changes/deletion to lists to local
 * @param {ReqDetails} request_details
 * @param {ReqDetails} complete_details
 * @param {function} callback
 * @param {List[]} data_lists
 */
function MUComm_UpdateLists(request_details, complete_details, callback, data_lists) {
	var form_data = request_details.requestBody.formData;
	var form_fields = Object.keys(form_data);

	for (var i = 0; i < form_fields.length; i++) {
		if (form_fields[i].includes("][title]")) {
			var list_num = parseInt(form_fields[i].substring(6, form_fields[i].indexOf("][title]")));
			var title_list = getListByEnum(data_lists, list_num);
			if (exists(title_list)) {
				title_list.list_name = form_data["lists[" + list_num + "][title]"][0];
			}

		} else if (form_fields[i].includes("][type]")) {
			var list_num = parseInt(form_fields[i].substring(6, form_fields[i].indexOf("][type]")));
			var type_list = getListByEnum(data_lists, list_num);
			if (exists(type_list)) {
				type_list.list_type = form_data["lists[" + list_num + "][type]"][0];
			}
		} else if (form_fields[i].includes("][description]")) {
			var list_num = parseInt(form_fields[i].substring(6, form_fields[i].indexOf("][description]")));
			var description_list = getListByEnum(data_lists, list_num);
			if (exists(description_list)) {
				description_list.list_description = form_data["lists[" + list_num + "][description]"][0];
			}

		} else if (form_fields[i].includes("deleteLists[]")){
			var remove_lists = form_data["deleteLists[]"];
			for (var j = 0; j < remove_lists.length; j++) {
				var list_num = parseInt(remove_lists[j]);
				var remove_list = getListByEnum(data_lists, list_num);
				var reading_list = getListById(data_lists, "read"); 
				moveAllSeriesInListToList(remove_list, reading_list);
				removeList(data_lists, remove_list);
			}
		}
	}
	callback();
}

/**
 * captures and saves the initial xhr to MU
 * @param {ReqDetails} request_details
 */
function handleMURequestComm(request_details){
	//TODO: garbage clean requests before saving
	console.log("Request");
	console.log(request_details);
	// filter out our own requests
	if (request_details.tabId >= 0) {
		loadRequest(request_details.requestId, function (req_details) {
			if (!exists(req_details)) {
				//avoid overwriting POST request
				saveRequest(request_details);
			}
		});
	}

	return;
}


/**
 * captures completed MU request and calls handler
 * @param {ReqDetails} complete_details
 */
function handleMUCompleteComm(complete_details){
	// filter out our own requests
	if (complete_details.tabId >= 0) {
		loadRequest(complete_details.requestId, function (request_details) {
			if (exists(request_details)) {
				var req_id = request_details.requestId;
				if (complete_details.requestId === req_id) {
					handleMUComm(request_details, complete_details);
					console.log("Complete");
					console.log(complete_details);
				} else console.log("Error: Request mismatch");
			} else {
				//console.warn("Warning: Failed to load request");
				//console.log(complete_details);
			}
		});
	}
}

/**
 * handles incomplete MU xhr
 * @param {ReqDetails} error_details
 */
function handleErrorMUComm(error_details){
	loadRequest(error_details.requestId, function(request_details){
		if (exists(request_details)) {
			var req_id = request_details.requestId;
			if (error_details.requestId === req_id){
				console.log("Request "+ req_id +" failed");
				deleteRequest(req_id);
			} else console.log("Error: Request mismatch");
		} else {
			console.warn("Warning: Failed to load request");
			console.log(error_details);
		}
	});
}

/**
 * Starts listening for requests to/from MU
 */
function beginListening(){
	chrome.webRequest.onBeforeRequest.addListener(handleMURequestComm, {urls: [ "*://www.mangaupdates.com/*" ]}, ["requestBody"]);
	chrome.webRequest.onCompleted.addListener(handleMUCompleteComm,{urls: [ "*://www.mangaupdates.com/*" ]});
	chrome.webRequest.onErrorOccurred.addListener(handleErrorMUComm,{urls: [ "*://www.mangaupdates.com/*" ]});
}


