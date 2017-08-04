/*#############################################################################
File: pop_builder.js

These functions build DOM elements relevant from all display states, such
as the Navbar and dev tools (if enabled).
#############################################################################*/

/**
 * builds top bar DOM element which is at the top of the screen
 * at all times. It contains buttons for navigation and editing. 
 * @param {List} data_lists
 * @returns {Element}
 */
function buildNavBar(data_lists) {
	var nav_bar = document.createElement("div");
	nav_bar.id = "navBar";

	//nav_bar.appendChild(buildDevTools());
	nav_bar.appendChild(buildCurrentListField(data_lists));
	nav_bar.appendChild(buildOptionsButton());
	nav_bar.appendChild(buildManageSeriesField(data_lists));
	nav_bar.appendChild(buildManageSeriesButton());
	return nav_bar;
}

/**
 * builds the navbar and page composing the default popup view
 * @param {Data} data
 */
function buildPopup(data) {
	let popup = document.createElement("div");
	popup.id = "popup";
	document.body.appendChild(popup);
	let nav_bar = buildNavBar(data.lists);
	popup.appendChild(nav_bar);
	let list = getListById(data.lists, "read");
	let series_page = buildSeriesPage(list);
	popup.appendChild(series_page);
	delayScrollbar(popup);
	changeVisibleCurrentListSelection("read");
}

/**
 * builds generic DOM navigation element for selecting between lists of series
 * @param {List} data_lists
 * @returns {Element}
 */
function buildListSelect(data_lists) {
	var list_select = document.createElement('select');
	list_select.className = 'listSelect';
	for (var i = 0; i < data_lists.length; i++) {
		var list_option = buildListOption(data_lists[i]);
		list_select.appendChild(list_option);
	}
	return list_select;
}

/**
 * builds generic DOM list option for list selects
 * @param {List} data_list
 * @returns {Element}
 */
function buildListOption(data_list) {
	var list_option = document.createElement('option');
	list_option.className = 'listOption';
	list_option.value = data_list.list_id;
	list_option.textContent = data_list.list_name;
	list_option.setAttribute("list_id", data_list.list_id);
	return list_option;
}

/**
 * builds DOM element containing the list selection element for switching
 * between lists, as well as the textual list filter for narrowing shown series
 * @param {List[]} data_lists
 * @returns {Element}
 */
function buildCurrentListField(data_lists) {
	var current_list_field = document.createElement("div");
	current_list_field.id = "currentListField";
	var current_list_select = buildCurrentListSelect(data_lists);
	var list_filter = buildListFilter();

	current_list_field.appendChild(current_list_select);
	current_list_field.appendChild(list_filter);
	return current_list_field;
}

/**
 * builds DOM navigation element for changing the displayed table of lists
 * @param {List[]} data_lists
 * @returns {Element}
 */
function buildCurrentListSelect(data_lists) {
	var current_list_select = document.createElement('select');
	current_list_select.className = 'listSelect';
	current_list_select.id = 'currentListSelect';
	for (var i = 0; i < data_lists.length; i++) {
		var list_option = buildCurrentListOption(data_lists[i]);
		current_list_select.appendChild(list_option);
	}
	current_list_select.onchange = handleCurrentListChange;

	return current_list_select;
}

/**
 * builds DOM list option for the current list select dropdown
 * @param {List} data_list
 * @returns {Element}
 */
function buildCurrentListOption(data_list) {
	var list_option = buildListOption(data_list);
	var list_text = data_list.list_name;
	var releases_in_list = getTotalNumNewReadingReleases([data_list]);
	if (releases_in_list > 0) {
		list_text = list_text.padEnd(16, "\u00a0");
		list_text = list_text + "(" + releases_in_list + ")!";
	}
	list_option.textContent = list_text;

	return list_option;
}

/**
 * builds DOM element for filtering shown series alphabetically
 * @returns {Element}
 */
function buildListFilter() {
	var list_filter = document.createElement("input");
	list_filter.id = ("seriesRowListFilter");
	list_filter.onkeyup = handleListFilter;
	list_filter.placeholder = "Filter Series";

	return list_filter;
}

/**
 * builds DOM container for series management elements (delete, move)
 * @param {List[]} data_lists
 * @returns {Element}
 */
function buildManageSeriesField(data_lists) {
	var manage_series_field = document.createElement("div");
	manage_series_field.id = "manageSeriesField";
	manage_series_field.style.display = "none"; // off until turned on

	var delete_series_button = buildDeleteSeriesButton();
	var move_series_button = buildMoveSeriesButton();
	var manage_series_list_select = buildManageSeriesListSelect(data_lists);
	var select_all_button = buildSelectAllButton();

	manage_series_field.appendChild(delete_series_button);
	manage_series_field.appendChild(move_series_button);
	manage_series_field.appendChild(manage_series_list_select);
	manage_series_field.appendChild(select_all_button);

	return manage_series_field;
}

/**
 * builds DOM button element for deleting selected series
 * @returns {Element}
 */
function buildDeleteSeriesButton() {
	var delete_series_button = document.createElement("div");
	delete_series_button.id = "deleteSeriesButton";
	delete_series_button.onclick = handleDeleteSeries;
	delete_series_button.title = "Delete Series";
	var delete_button_desc = document.createElement("span");
	delete_button_desc.id = "deleteButtonDescription";
	delete_button_desc.textContent = "\u2620\uFE0E";
	delete_series_button.appendChild(delete_button_desc);

	return delete_series_button;
}

/**
 * builds DOM button for moving selected series from list to list
 * @returns {Element}
 */
function buildMoveSeriesButton() {
	var move_series_button = document.createElement("div");
	move_series_button.id = "moveSeriesButton";
	move_series_button.onclick = handleMoveSeries;
	move_series_button.title = "Move Series";
	var move_button_desc = document.createElement("span");
	move_button_desc.id = "moveButtonDescription";
	move_button_desc.textContent = "Move \u21FE";
	move_series_button.appendChild(move_button_desc);
	return move_series_button;
}

/**
 * builds DOM element for selecting a list to move series to
 * @param {List[]} data_lists
 * @returns {Element}
 */
function buildManageSeriesListSelect(data_lists) {
	var manage_series_list_select = buildListSelect(data_lists);
	manage_series_list_select.id = 'manageSeriesListSelect';

	return manage_series_list_select;
}

/**
 * builds DOM button for selecting all visible series at once
 * @returns {Element}
 */
function buildSelectAllButton() {
	var select_all_button = document.createElement("div");
	select_all_button.id = "selectAllButton";
	select_all_button.onclick = handleSelectAllSeries;
	return select_all_button;
}

/**
 * builds DOM button for toggling series management mode
 * @returns {Element}
 */
function buildManageSeriesButton() {
	var manage_series_button = document.createElement('div');
	manage_series_button.id = "manageSeriesButton";
	manage_series_button.onclick = handleManageSeries;
	manage_series_button.title = "Manage Series";
	var manage_button_desc = document.createElement('span');
	manage_button_desc.id = "manageButtonDescription";
	manage_button_desc.textContent = "\u270D\uFE0E";
	manage_series_button.setAttribute("toggle", "off");

	manage_series_button.appendChild(manage_button_desc);
	return manage_series_button;
}

function buildPageField(region, current_page_num, num_pages) {
	let page_field = document.createElement('div');
	page_field.className = "pageField";
	page_field.setAttribute("region", region);
	
	if (current_page_num > 1) {
		let prev_button = buildPageButtonPrev(region, current_page_num - 1);
		page_field.appendChild(prev_button);
	}
	if (num_pages > current_page_num) {
		let next_button = buildPageButtonNext(region, current_page_num + 1);
		page_field.appendChild(next_button);
	}
	return page_field;
}

function buildPageButton() {
	let page_button = document.createElement('div');
	page_button.className = "pageButton";

	return page_button;
}

function buildPageDesc() {
	let page_desc = document.createElement('span');
	page_desc.className = "pageButtonDescription";
	return page_desc;
}

function buildPageButtonPrev(region, page_num) {
	let prev_button = buildPageButton();
	let prev_desc = buildPageDesc();
	prev_desc.textContent = "⇽ " + page_num;
	prev_button.appendChild(prev_desc);
	prev_button.classList.add("pagePrev");
	prev_button.setAttribute("region", region);
	prev_button.onclick = function () {
		decrementPage(getPageButtonsPage(prev_button));
	}

	return prev_button;
}

function buildPageButtonNext(region, page_num) {
	let next_button = buildPageButton();
	let next_desc = buildPageDesc();
	next_desc.textContent = page_num + " ⇾";
	next_button.appendChild(next_desc);
	next_button.classList.add("pageNext");
	next_button.setAttribute("region", region);
	next_button.onclick = function () {
		incrementPage(getPageButtonsPage(next_button));
	}

	return next_button;
}

function buildSeriesPage(data_list) {
	let series_page = buildPage();
	series_page.classList.add('seriesPage');
	let series_table = buildSeriesTable(data_list);
	let top_page_field = buildPageField("top", pop.paging.current_page_num, pop.paging.num_pages);
	let bot_page_field = buildPageField("bottom", pop.paging.current_page_num, pop.paging.num_pages);

	series_page.appendChild(top_page_field);
	series_page.appendChild(series_table);
	series_page.appendChild(bot_page_field);

	updatePaging(series_page);

	return series_page;
}

function buildPage() {
	let page = document.createElement('div');
	page.className = 'page';
	return page;
}

/**
 * builds page for redirecting user to login or register at MU
 * @returns {Element}
 */
function buildRedirectPage() {
	var redirect_page = document.createElement('div');
	var redirect_box = document.createElement('div');
	var redirect_text = document.createElement('span');
	var redirect_login = document.createElement('div');
	var redirect_register = document.createElement('div');
	redirect_page.id = "redirectPage";
	redirect_box.id = "redirectBox";
	redirect_box.className = "enBox";
	redirect_text.id = "redirectText";
	redirect_text.textContent = "Use of en requires a mangaupdates.com account.";
	redirect_login.id = "loginButton";
	redirect_login.className = "enButton";
	redirect_login.textContent = "Login"
	redirect_register.id = "registerButton";
	redirect_register.className = "enButton";
	redirect_register.textContent = "Register";

	redirect_login.onclick = (function () {
		chrome.tabs.create({
			active: true, url: "https://www.mangaupdates.com/"
		}, function () {
			if (chrome.runtime.lastError) {
				console.error("Failed to load login page: " + chrome.runtime.lastError.message);
			}
		})
	});

	redirect_register.onclick = (function () {
		chrome.tabs.create({
			active: true, url: "https://www.mangaupdates.com/signup.html"
		}, function () {
			if (chrome.runtime.lastError) {
				console.error("Failed to load register page: " + chrome.runtime.lastError.message);
			}
		})
	});

	redirect_box.appendChild(redirect_text);
	redirect_box.appendChild(redirect_login);
	redirect_box.appendChild(redirect_register);
	redirect_page.appendChild(redirect_box);

	return redirect_page;
}

/**
 * dev tool DOM button for easy clearing of all chrome extension data
 * @returns {Element}
 */
function buildClearAllDataButton() {
	var clear_all_data_button = document.createElement('button');
	clear_all_data_button.className = "clearAllDataButton";
	clear_all_data_button.onclick = handleClickedClearAllData;
	clear_all_data_button.textContent = "Clear all data";
	return clear_all_data_button;
}

/**
 * dev tool DOM button for running full data pull from MU
 * @returns {Element}
 */
function buildPullAllDataButton() {
	var pull_all_data_button = document.createElement('button');
	pull_all_data_button.className = "pullAllDataButton";
	pull_all_data_button.onclick = handleClickedPullAllData;
	pull_all_data_button.textContent = "Pull all data";
	return pull_all_data_button;
}

/**
 * dev tool DOM button for running series update module
 * @returns {Element}
 */
function buildUpdateListsButton() {
	var update_lists_button = document.createElement('button');
	update_lists_button.className = "updateListsButton";
	update_lists_button.onclick = handleClickedUpdateLists;
	update_lists_button.textContent = "Update lists";
	return update_lists_button;
}

/**
 * dev tool DOM button for rebuilding the popup from scratch
 * @returns {Element}
 */
function buildRebuildPopupButton() {
	var rebuild_popup_button = document.createElement('button');
	rebuild_popup_button.className = "rebuildPopupButton";
	rebuild_popup_button.onclick = handleClickedRebuildPopup;
	rebuild_popup_button.textContent = "Rebuild Popup";
	return rebuild_popup_button;
}

/**
 * TODO: Implement the functions to support this
 * DOM element for showing user errors
 * @returns {Element}
 */
function buildErrorBar() {
	var error_bar = document.createElement('div');
	error_bar.id = "errorBar";
	error_bar.style.display = "none";
	return error_bar;
}

/**
 * builds DOM element top bar for easy debugging function buttons
 * @returns {Element}
 */
function buildDevTools() {
	var dev_toolbar = document.createElement('div');
	var clear_all_data_button = buildClearAllDataButton();
	var pull_all_data_button = buildPullAllDataButton();
	var update_lists_button = buildUpdateListsButton();
	var rebuild_popup_button = buildRebuildPopupButton();

	dev_toolbar.appendChild(clear_all_data_button);
	dev_toolbar.appendChild(pull_all_data_button);
	dev_toolbar.appendChild(update_lists_button);
	dev_toolbar.appendChild(rebuild_popup_button);
	return dev_toolbar;
}