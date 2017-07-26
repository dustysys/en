/*#############################################################################
File: pop_action.js

Actual changes to the DOM or, in particular, changes to the data model are
executed in these functions.
#############################################################################*/

/**
 * initiates marking series up to date and changes display elements to match
 * the data is saved, an updated series row built and the updated chapter pushed to MU
 * @param {Event} event
 */
function pullSeriesRowUpToDate(series_row) {
	var table = getSeriesRowsTable(series_row);
	var series_id = getSeriesRowsId(series_row);
	userPullThenPushSeriesUpToDate(series_id, function (data) {
		// in case sync thread changed parent element
		var async_series_row = table.querySelector(".seriesRow[series_id=s" + series_id + "]");
		var list = getList(data.lists, async_series_row.getAttribute("list_id"));
		var series = getSeriesById([list], series_id);
		var updated_row = updateSeriesRow(async_series_row, list, series);
		var uptodate_button = getSeriesRowsUpToDateButton(updated_row);
		uptodate_button.style.display = "none";
		updateListState(list.list_id);
	});

	finalizeMarkSeriesRowUpToDate(series_row);
}


/**
 * Gets the latest release for a series on the popup and in the model
 * @param {Element} series_row
 */
function updateSeriesRowsLatestRelease(series_row) {
	var series_id = getSeriesRowsId(series_row);
	userPullSeriesLatestRelease(series_id, function (data) {
		var list = getList(data.lists, series_row.getAttribute("list_id"));
		var series = getSeriesById([list], series_id);
		var updated_row = updateSeriesRow(series_row, list, series);
		var updated_uptodate_button = getSeriesRowsUpToDateButton(updated_row);
		updateListState(list.list_id);
		updated_uptodate_button.onclick = (function () {
			executeMarkSeriesRowUpToDate(updated_row);
		});
	});
}

/**
 * inserts a series row marked up-to-date in its correct sorted position
 * and plays an animation of it doing so
 * @param {Element} series_row
 */
function finalizeMarkSeriesRowUpToDate(series_row) {
	var uptodate_button = getSeriesRowsUpToDateButton(series_row)
	hideElement(uptodate_button);
	var start_el_index = listFilterIsInUse() ? getIndexOfVisibleSeriesRow(series_row) : getIndexOfSeriesRowInDOM(series_row);
	var start_bbox = series_row.getBoundingClientRect();
	var end_el_index = sortInsertMarkedReadSeriesRow(series_row);
	if (listFilterIsInUse()) end_el_index = getIndexOfVisibleSeriesRow(series_row);
	var end_bbox = series_row.getBoundingClientRect();
	animateSeriesUpdate(series_row, start_el_index, end_el_index, start_bbox, end_bbox);
}

/**
 * marks a series up to date in the model, pushes it to MU and updates the row
 * on the popup
 * @param {Element} series_row
 * @param {function(Element)} callback
 */
function executeMarkSeriesRowUpToDate(series_row, callback) {
	var series_id = getSeriesRowsId(series_row);
	userPushSeriesUpToDate(series_id, function (data) {
		var list = getList(data.lists, series_row.getAttribute("list_id"));
		var series = getSeriesById([list], series_id);
		var updated_row = updateSeriesRow(series_row, list, series);
		updateListState(list.list_id);
		if (callback) callback(updated_row);
	});
}

/**
 * changes the up-to-date button's text to a down arrow prompt
 * @param {Element} series_row
 */
function giveSeriesRowSortPrompt(series_row) {
	var uptodate_button = getSeriesRowsUpToDateButton(series_row);
	uptodate_button.textContent = "\u2b07";
	uptodate_button.style.fontSize = "14px";
	uptodate_button.style.display = "";
	series_row.setAttribute("unsorted", "true");
	uptodate_button.onclick = (function (event) {
		if (event.altKey) return;
		finalizeMarkSeriesRowUpToDate(series_row);
	});
}

/**
 * determines what to do when user clicks up-to-date button
 * @param {Event} event
 */
function handleUpToDate(event) {
	if (event.altKey) return;
	var series_row = getUpToDateButtonsSeriesRow(event.target);
	if (global_pref_one_click_uptodate.enabled) {
		pullSeriesRowUpToDate(series_row);
	} else {
		var uptodate_button = event.target;
		var uptodate_status = uptodate_button.getAttribute("up_to_date");

		if (uptodate_status === "unknown") {
			updateSeriesRowsLatestRelease(series_row);
		} else {
			executeMarkSeriesRowUpToDate(series_row, function (updated_row) {
				if (!isLastVisibleSeriesRow(updated_row)) {
					giveSeriesRowSortPrompt(updated_row);
				}
			});
		}
	}
}

/**
 * replaces series row with updated version without touching
 * its (potentially animated) wrapper
 * @param {Element} series_row
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element} updated row
 */
function updateSeriesRow(series_row, data_list, data_series) {
	var series_row_wrap = getSeriesRowsWrap(series_row);
	var updated_row_wrap = buildSeriesRow(data_list, data_series);
	replaceElementInPlace(updated_row_wrap, series_row_wrap);
	return updated_row_wrap.firstChild;
}

/**
 * updates series row on the popup, called when local function has no
 * need to access data otherwise
 * @param {Element} series_row
 * @param {function(Element)} callback
 */
function updateUnloadedSeriesRow(series_row, callback) {
	loadData(function (data) {
		var series_id = getSeriesRowsId(series_row);
		var series = getSeriesById(data.lists, series_id);
		var list_id = series_row.getAttribute("list_id");
		var list = getListById(data.lists, list_id);
		var updated_row = updateSeriesRow(series_row, list, series);
		if (callback) callback(updated_row);
	});
}

/**
 * inserts series row in proper place assuming array is pre-sorted
 * @param {Element} series_row
 * @return {Number} new index of series row 
 */
function sortInsertMarkedReadSeriesRow(series_row) {
	var title = series_row.querySelector(".titleLink").textContent;
	var table = getSeriesRowsTable(series_row);
	var row_titles = table.querySelectorAll(".titleLink");

	if (row_titles.length === 1) return;
	let index = 0;
	while (index < row_titles.length) {
		var row = getTitleLinksSeriesRow(row_titles[index]);
		var has_new_releases = row.getAttribute("new_releases") === "true";
		var is_sorted = !(row.hasAttribute("unsorted"));
		if (!has_new_releases && is_sorted) {
			if (title.toUpperCase() < row_titles[index].textContent.toUpperCase()) {
				break;
			}
		}
		index++;
	}

	if (series_row.hasAttribute("unsorted")) series_row.removeAttribute("unsorted");
	var series_row_wrap = getSeriesRowsWrap(series_row);
	table.insertBefore(series_row_wrap, table.children[index]);
	return index - 1;
}

/**
 * replaces element without modifying its DOM position
 * @param {Element} new_el
 * @param {Element} old_el
 */
function replaceElementInPlace(new_el, old_el) {

	old_el.parentElement.replaceChild(new_el, old_el);

}

/**
 * resets the all series select button
 */
function resetSelectAllSeriesButton() {
	document.getElementById("selectAllButton").setAttribute("toggle", "off");
}

/**
 * resets the toggle for every series select button
 */
function resetAllSelectSeriesButtons() {
	resetSelectAllSeriesButton();
	var select_buttons = document.body.querySelectorAll(".seriesSelectButton");
	for (var i = 0; i < select_buttons.length; i++) {
		select_buttons[i].setAttribute("toggle", "off");
	}
}

/**
 * swaps between visibility of marked up to date and series select button visibilities
 * @param {boolean} toggle
 */
function toggleSeriesSelectVisibility(toggle) {

	var uptodate_buttons = document.body.getElementsByClassName("upToDateButton");
	var select_buttons = document.body.getElementsByClassName("seriesSelectWrap");

	for (var i = 0; i < uptodate_buttons.length; i++) {
		var uptodate_status = uptodate_buttons[i].getAttribute("up_to_date");
		if (uptodate_status === "false" || uptodate_status === "unknown") {
			toggleElementVisibility(uptodate_buttons[i], !toggle);
		}
	}

	for (var i = 0; i < select_buttons.length; i++) {
		toggleElementVisibility(select_buttons[i], toggle);
	}
}

/**
 * toggles visibility for all link buttons
 * @param {boolean} toggle
 */
function toggleEditLinkVisibility(toggle) {
	var link_wraps = document.body.getElementsByClassName("editLinkWrap");
	for (var i = 0; i < link_wraps.length; i++) {
		toggleElementVisibility(link_wraps[i], toggle);
	}
}

/**
 * switches an elements toggle attribute, returns toggle's new truth value
 * @param {Element}
 * @returns {boolean}
 */
function toggleElement(element) {
	var toggle = element.getAttribute("toggle") === "on";
	element.setAttribute("toggle", toggle ? "off" : "on");
	return !toggle;
}

/**
 * generic function for toggling any element's visibility
 * @param {Element} el
 * @param {boolean} toggle
 */
function toggleElementVisibility(el, toggle) {
	if (typeof toggle === "boolean") {
		toggle ? showElement(el) : hideElement(el);
	} else console.error("Error: toggleElement requires toggle");
}

/**
 * makes an element disappear from DOM flow
 * @param {Element} el
 */
function hideElement(el) {
	fastdom.mutate(function () { el.style.display = "none"; });
}

/**
 * makes an element present in DOM flow
 * @param {Element} el
 */
function showElement(el) {
	fastdom.mutate(function () { el.style.display = ""; });
}

/**
 * toggles visibility of the manage series field elements
 * @param {boolean} toggle
 */
function toggleManageFieldVisibility(toggle) {
	var manage_field = document.getElementById("manageSeriesField");
	var options_button = document.getElementById("optionsButton");
	toggleElementVisibility(manage_field, toggle);
	toggleElementVisibility(options_button, !toggle);
	global_block_transitions = false;
}

/**
 * toggles the visibility for all elements attached to manage mode
 * @param {boolean} toggle
 */
function toggleManageModeVisibility(toggle) {
	toggleManageFieldVisibility(toggle);
	toggleSeriesSelectVisibility(toggle);
	toggleEditLinkVisibility(toggle);
}

/**
 * toggles the display beteen lists and the option page
 * @param toggle
 */
function toggleOptionPageVisibility(toggle) {
	window.scrollTo(0, 0);
	var opt_tables = document.getElementsByClassName("optionTable");
	var popup = document.getElementById("popup");
	if (toggle) {
		hideAllLists();
		if (opt_tables.length === 0) {
			popup.appendChild(buildOptionTable());
		} else {
			toggleElementVisibility(opt_tables[0], toggle);
		}
	} else {
		if (opt_tables.length > 0) {
			toggleElementVisibility(opt_tables[0], toggle);
			changeToSelectedCurrentList();
		}
	}
}

/**
 * toggles the visibility between option mode buttons and other buttons
 * @param {boolean} toggle
 */
function toggleOptionModeVisibility(toggle) {
	var other_buttons = document.querySelectorAll('#manageSeriesButton, #currentListField');
	for (var i = 0; i < other_buttons.length; i++) {
		toggleElementVisibility(other_buttons[i], !toggle);
	}
}

/**
 * removes selected series from popup, locally and pushes deletion to MU
 */
function handleDeleteSeries() {
	var series_rows = getVisibleSeriesRows();
	var delete_series_id_arr = [];
	for (var i = 0; i < series_rows.length; i++) {
		var select_button = getSeriesRowsSeriesSelectButton(series_rows[i]);
		if (select_button.getAttribute("toggle") === "on") {
			delete_series_id_arr.push(getSeriesRowsId(series_rows[i]));
			series_rows[i].parentElement.removeChild(series_rows[i]);
		}
	}
	var list_src_id = getCurrentListId();

	userDeleteSeries(list_src_id, delete_series_id_arr, function () {
		updateListState(list_src_id);
	});
}

/**
 * changes series to a different list on popup, locally and pushes move to MU
 */
function handleMoveSeries() {
	var list_src_id = getCurrentListId();
	var list_dst_id = getMoveToListId();
	if (list_src_id === list_dst_id) return;
	var series_rows = getVisibleSeriesRows();

	var move_series_id_arr = [];
	for (var i = 0; i < series_rows.length; i++) {
		var select_button = getSeriesRowsSeriesSelectButton(series_rows[i]);
		if (select_button.getAttribute("toggle") === "on") {
			move_series_id_arr.push(getSeriesRowsId(series_rows[i]));
			series_rows[i].parentElement.removeChild(series_rows[i]);
		}
	}

	userMoveSeries(list_src_id, list_dst_id, move_series_id_arr, function (data) {
		updateListState(list_src_id, function () {
			updateListState(list_dst_id);
		});
	});
}

/**
 * switches the currently viewed list table to the one
 * selected in the current list dropdown
 */
function changeToSelectedCurrentList() {
	window.scrollTo(0, 0);
	var list_id = getCurrentListId();
	var list_tables = document.getElementsByClassName("listTable");
	var found = false;
	fastdom.mutate(function () {
		for (var i = 0; i < list_tables.length; i++) {
			if (list_tables[i].getAttribute("list_id") === list_id) {
				list_tables[i].style.display = "";
				found = true;
			}
			else {
				list_tables[i].style.display = "none";
			}
		}

		if (!found) {
			loadData(function (data) {
				var popup = document.getElementById("popup");
				var data_list = getList(data.lists, list_id);
				var new_table = buildListTable(data_list);
				popup.appendChild(new_table);
			});
		}
	});
}

/**
 * makes all list tables no longer visible
 * @param {function} callback
 */
function hideAllLists(callback) {
	var list_tables = document.getElementsByClassName("listTable");
	fastdom.mutate(function () {
		for (var i = 0; i < list_tables.length; i++) {
			list_tables[i].style.display = "none";
		}
		if (callback) callback();
	});
}

/**
 * removes the specified list table from the DOM
 * @param {string} list_id
 * @param {function} callback
 */
function unloadList(list_id, callback) {
	var list_table = getListTableById(list_id);
	if (list_table !== null) {
		fastdom.mutate(function () {
			list_table.parentElement.removeChild(list_table);
			if (callback) callback();
		});
	}
}

/**
 * removes all list tables from the DOM
 * @param {function} callback
 */
function unloadAllLists(callback) {
	var list_tables = document.getElementsByClassName("listTable");
	fastdom.mutate(function () {
		var i = list_tables.length - 1;
		while (i >= 0) {
			list_tables[i].parentElement.removeChild(list_tables[i]);
			i--;
		}
		if (callback) callback();
	});
}

/**
 * updates information about a list, such as its unread series count
 * and its contents. Also updates the badge.
 * @param {string} list_id
 */
function updateListState(list_id, callback) {

	function finishUpdateListState(list_option, callback) {
		updateCurrentListOption(list_option, function () {
			popupSendBgBadgeUpdateRequest();
			if (callback) callback();
		});
	}

	var current_list_select = document.getElementById("currentListSelect");
	var current_list_id = getCurrentListId();
	var list_option = current_list_select.querySelector('[list_id=' + list_id + ']');
	if (list_id !== current_list_id) {
		// defer update
		unloadList(list_id, function () {
			finishUpdateListState(list_option, callback);
		});

	} else {
		// do current-list specific things
		finishUpdateListState(list_option, callback);
	}
}

/**
 * updates the specified list option with fresh data, including updating the number
 * of unread releases
 * @param {Element} list_option
 * @param {function} callback
 */
function updateCurrentListOption(list_option, callback) {
	loadData(function (data) {
		var list = getListById(data.lists, list_option.getAttribute("list_id"));
		var updated_list_option = buildCurrentListOption(list);
		var current_list_id = getCurrentListId();
		replaceElementInPlace(updated_list_option, list_option);
		changeVisibleCurrentListSelection(current_list_id);
		if (callback) callback();
	});
}

/**
 * updates the user input volume and chapter on popup, locally and pushes change to MU
 * @param {Element} series_row
 * @param {string} vol_input
 * @param {string} chap_input
 * @param {function} callback
 */
function handleUserMUReadUpdate(series_row, vol_input, chap_input, callback) {
	var read_volume = series_row.querySelector(".readVolume");
	var read_volume_desc = series_row.querySelector(".readVolumeDescription");
	var read_chapter = series_row.querySelector(".readChapter");
	var read_chapter_desc = series_row.querySelector(".readChapterDescription");
	var not_applic = series_row.querySelector(".readChapVolNA");
	var volume = vol_input.value;
	var chapter = chap_input.value;
	if (volume === read_volume.textContent && chapter === read_chapter.textContent) {
		//no change
	} else {
		var series_id = getSeriesRowsId(series_row);
		userManualUpdateVolumeChapter(series_id, volume, chapter);
	}

	read_volume.textContent = volume;
	read_chapter.textContent = chapter;
	vol_input.parentElement.removeChild(vol_input);
	chap_input.parentElement.removeChild(chap_input);
	if (volume === "") {
		read_volume_desc.style.display = "none";
		read_volume.style.display = "none";
	} else {
		read_volume.style.display = "";
	}
	if (chapter === "") {
		read_chapter_desc.style.display = "none";
		read_chapter.style.display = "none";
	} else {
		read_chapter.style.display = "";
	}
	if (volume === "" && chapter === "") {
		not_applic.style.display = "";
	}
}

/**
 * shows/hides series rows based on presence of string in series title
 * @param {string} filter
 */
function filterList(filter) {
	var current_list = getCurrentListId();
	var titles = document.querySelectorAll(".seriesRow[list_id=" + current_list + "] .titleLink");
	interruptAllAnimations();
	for (var i = 0; i < titles.length; i++) {
		var series_row = getTitleLinksSeriesRow(titles[i]);
		if (titles[i].textContent.toUpperCase().includes(filter)) {
			series_row.style.display = "";
		} else {
			series_row.style.display = "none";
		}
	}
}

/**
 * changes the current selected list to the one specified
 * @param {list_id} list_id
 */
function changeVisibleCurrentListSelection(list_id) {
	var current_list_select = document.getElementById('currentListSelect');
	var list_option = current_list_select.querySelector('[list_id=' + list_id + ']');
	current_list_select.selectedIndex = getIndexOfElementInDOM(list_option);
}

/**
 * rebuilds the popup from scratch
 */
function rebuildPopup() {
	loadData(function (data) {
		clearPopup();
		buildPopup(data);
	});
}

/**
 * removes all (sub-body) DOM elements from popup
 */
function clearPopup() {
	while (document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	}
}

/**
 * adds transient delay to give scrollbar time to appear so that scrolling works
 * correctly when the scrollbar is removed. Yes, this is a hack.
 * @param popup
 */
function delayScrollbar(popup) {
	setTimeout(function () { popup.style.paddingBottom = "0px"; }, 10);
}

/**
 * builds the navbar, listtable etc composing the default popup view
 * @param {Data} data
 */
function buildPopup(data) {
	data.lists.sort(cmpListAlphabetical);

	var popup = document.createElement("div");
	popup.id = "popup";
	document.body.appendChild(popup);
	var nav_bar = buildNavBar(data.lists);
	popup.appendChild(nav_bar);
	var list = getListById(data.lists, "read");
	var list_table = buildListTable(list);
	popup.appendChild(list_table);
	delayScrollbar(popup);
	changeVisibleCurrentListSelection("read");
}

/**
 * Redirects the user if they are not logged in to MU
 */
function redirectToLogin() {
	var redirect_page = buildRedirectPage();
	document.body.append(redirect_page);

	console.log("Attempted redirect.");
}

/**
 * if chrome.storage fails to load data or user info this will either
 * prompt the user or to address them or if there is a current session
 * it will do nothing so as not to interfere with user
 * @param {string} current_user_id
 * @param {string} logged_in_user_id
 */
function handleSessionErrors(current_user_id, logged_in_user_id) {
	var no_session = !exists(current_user_id);
	var no_login = !exists(logged_in_user_id);

	if (no_session) {
		if (no_login) {
			redirectToLogin();
		} else console.error("Error: Session load failed");
	} else {
		if (current_user_id !== "No User") {
			redirectToLogin();
		} // else do nothing
	}
}

/**
 * determines if the session (current user, login and data) is valid and
 * consistent with previous session. If not, it will either create a new
 * session, prompt the user to login, or do nothing (if it is valid)
 * @param {Data} data
 */
function validateSession(data) {
	pullUserSessionInfo(function (current_user_id, logged_in_user_id) {
		if (!exists(current_user_id) || !exists(logged_in_user_id)) {
			handleSessionErrors();
		}

		if (logged_in_user_id === "No User") {
			if (current_user_id === "No User") {
				redirectToLogin();
			} else if (current_user_id !== "No User") {
				//do nothing
			}
		} else {
			if (current_user_id === "No User") {
				initializeNewSession(logged_in_user_id, rebuildPopup);
			} else if (current_user_id !== logged_in_user_id) {
				initializeNewSession(logged_in_user_id, rebuildPopup);
			} else if (data === "No Data") {
				initializeNewSession(current_user_id, rebuildPopup);
			}//else session is valid
		}
	});
}


/**
 * applies and refreshes effects of global preferences
 */
function popupApplyPrefs() {
	if (global_pref_scrollbar.enabled) {
		document.body.classList.remove("noScroll");
	} else {
		document.body.className = "noScroll";
	}

	if (global_pref_animations.enabled) {
		//shouldn't be necessary but just in case
		global_block_transitions = false;
	}
}