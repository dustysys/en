/*#############################################################################
File: pop_action.js

These functions modify the global popup display state or global extension data.
#############################################################################*/

/**
 * Sort a list of elements into a preset number of pages
 * @param {Element[]} els 
 */
function pageElements(els) {
	let current_page = pop.paging.current_page_num;
	let els_per_page = 30;
	els.forEach((el, index) => {
		let page_num = Math.floor(index / els_per_page) + 1;
		el.setAttribute("page", page_num.toString());
	});

	let last_el_page = parseInt(els[els.length - 1].getAttribute("page"));
	if (last_el_page < current_page) {
		pop.paging = {
			num_pages: last_el_page,
			current_page_num: last_el_page
		}
	}
	updatePageVisibility(els);
}

/**
 * Determines and modified visibility of each element based on current page1
 * @param {Element[]} els 
 */
function updatePageVisibility(els) {
	els.forEach((el, index) => {
		if (el.getAttribute("page") !== pop.paging.current_page_num.toString()) {
			el.style.display = "none";
		} else {
			el.style.display = "";
		}
	});
}

/**
 * Calculates and records the current number of pages required
 * @param {Element[]} els 
 */
function updateNumPages(els) {
	let els_per_page = 30;
	pop.paging.num_pages = Math.floor(els.length / els_per_page) + 1;
}

/**
 * Updates the page buttons to reflect current indexing
 * @param {Element} page 
 */
function updatePageButtons(page) {
	let page_fields = page.querySelectorAll('.pageField');
	page_fields.forEach(field => {
		let region = field.getAttribute('region');
		let updated_field = buildPageField(region, pop.paging.current_page_num,
			pop.paging.num_pages);
		replaceElementInPlace(updated_field, field);
	});
}

/**
 * Re-indexes the rows into pages based on the rows currently visible
 * @param {Element} page 
 */
function updatePaging(page) {
	var currentNavPage = getCurrentNavPage();
	let rows = page.querySelectorAll("." + currentNavPage + "Row:not([filtered])");
	if (rows.length > 0) {
		pageElements(rows);
	}
	updateNumPages(rows);
	updatePageButtons(page);
}

/**
 * Reset view to first page
 */
function resetCurrentPage() {
	pop.paging.current_page_num = 1;
}

/**
 * Trigger navigation to previous page
 * @param {Element} page 
 */
function decrementPage(page) {
	pop.paging.current_page_num--;
	updatePaging(page);
	window.scrollTo(0, 0);
	resetAllSelectSeriesButtons();
	resetSelectAllSeriesButton();
}

/**
 * Trigger navigation to next page
 * @param {Element} page 
 */
function incrementPage(page) {
	pop.paging.current_page_num++;
	updatePaging(page);
	window.scrollTo(0, 0);
	resetAllSelectSeriesButtons();
	resetSelectAllSeriesButton();
}

/**
 * switches the currently viewed list table to the one
 * selected in the current list dropdown
 */
function changeToSelectedCurrentList() {
	resetCurrentPage();
	window.scrollTo(0, 0);
	var list_id = getCurrentListId();
	var currentNavPage = getCurrentNavPage();
	var tables = document.getElementsByClassName( currentNavPage + "Table");
	var found = false;
	fastdom.mutate(function () {
		for (var i = 0; i < tables.length; i++) {
			let page = getTablesPage(tables[i]);
			if (tables[i].getAttribute("list_id") === list_id) {
				updatePaging(page);
				page.style.display = "";
				found = true;
			}
			else {
				page.style.display = "none";
			}
		}

		if (!found) {
			loadData(function (data) {
				var popup = document.getElementById("popup");
				var data_list = getList(data.lists, list_id);
				var new_page;
				if (currentNavPage === "series") {
					new_page = buildSeriesPage(data_list);
				} else if (currentNavPage === "release") {
					new_page = buildReleasePage(data_list);
				} else return;
				popup.appendChild(new_page);
			});
		}
	});
}

/**
 * Returns a string representation of the currently viewed page
 * @returns {string} page
 */
function getCurrentNavPage(){
	if (optionsPageOn()) { return "options"; }
	if (releasePageOn()) { return "release"; }
	if (seriesPageOn()) { return "series"; }
	else return "series";
}

function toggleOffAllNavButtons(callback) {
	let nav_buttons = document.getElementsByClassName("navButton");
	fastdom.mutate(function () {
		for (var i = 0; i < nav_buttons.length; i++) {
			nav_buttons[i].setAttribute("toggle", "off");
		}
		if (callback) callback();
	});
}

/**
 * resets the all series select button
 */
function resetSelectAllSeriesButton() {
	document.getElementById("selectAllButton").setAttribute("toggle", "off");
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
	pop.block_transitions = false;
}

/**
 * toggles the visibility for all elements attached to manage mode
 * @param {boolean} toggle
 */
function toggleManageModeVisibility(toggle) {
	toggleManageFieldVisibility(toggle);
	toggleSeriesSelectVisibility(toggle);
	toggleEditLinkVisibility(toggle);
	toggleCopyTitleVisibility(toggle);
	toggleTabURLAsLinkVisibility(toggle);
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
		hideAllPages();
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
 * Redirects the user if they are not logged in to MU
 */
function redirectToLogin() {
	var redirect_page = buildRedirectPage();
	document.body.append(redirect_page);

	console.log("Attempted redirect.");
}

/**
 * applies and refreshes effects of global preferences
 */
function popupApplyPrefs() {
	if (pop.prefs.scrollbar.enabled) {
		document.body.classList.remove("noScroll");
	} else {
		document.body.className = "noScroll";
	}

	if (pop.prefs.animations.enabled) {
		//shouldn't be necessary but just in case
		pop.block_transitions = false;
	}
}

/**
 * if chrome.storage fails to load data or user info this will either
 * prompt the user or to address them or if there is a current session
 * it will do nothing so as not to interfere with user
 * @param {string} current_user_id
 * @param {string} logged_in_user_id
 */
function popupHandleSessionErrors(current_user_id, logged_in_user_id) {
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
 * determines if the session (current user, login and data) is acceptable
 * for the usage of the popup. I.e., there is valid information for the
 * user to view and interact with. If not, it will either create a new
 * session, prompt the user to login, or do nothing.
 * @param {Data} data
 */
function popupHandleInvalidSession(data) {
	pullUserSessionInfo(function (current_user_id, logged_in_user_id) {
		if (!exists(current_user_id) || !exists(logged_in_user_id)) {
			popupHandleSessionErrors();
		}

		if (logged_in_user_id === "No User") {
			if (current_user_id === "No User") {
				redirectToLogin();
			} else if (current_user_id !== "No User") {
				//session is suitable for popup
			}
		} else {
			if (current_user_id === "No User"
				|| current_user_id !== logged_in_user_id
				|| data === "No Data") {
				attemptNewSession(
					function success() {
						console.log("New session initialized from popup");
						rebuildPopup();
					},
					function error(msg) {
						console.log("Failed to initialize new session from popup");
						console.warn("Warning: " + msg);
					}
				);
			} //else session is suitable for popup
		}
	});
}