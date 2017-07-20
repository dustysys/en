/*#############################################################################
File: pop_builder.js

These functions build DOM elements composed with the local List-Series-Release
data, and connect to these elements the functions for letting the user interact
with that model. 
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
 * builds DOM element which contains all the rows for each series
 * @param {List} data_list
 * @returns {Element}
 */
function buildListTable(data_list) {
	var list_table = document.createElement("div");
	list_table.className = "listTable";
	list_table.setAttribute("list_id", data_list.list_id);
	list_table.setAttribute("list_type", data_list.list_type);
	var s_list = data_list.series_list;
	s_list.sort(cmpReleaseAlphabetical);
	for (var i = 0; i < s_list.length; i++) {
		var series_row = buildSeriesRow(data_list, s_list[i]);
		list_table.appendChild(series_row);
	}

	return list_table;
}

/**
 * builds DOM element that encapsulates all info and editing capacity for
 * a series, this composes most the window
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildSeriesRow(data_list, data_series) {
	var series_row_wrap = document.createElement('div');
	series_row_wrap.className = "seriesRowWrap";
	var series_row = document.createElement('div');
	series_row.className = "seriesRow";
	series_row.setAttribute("list_id", data_list.list_id);
	series_row.setAttribute("series_id", "s" + data_series.series_id);
	if (data_list.list_type == "read" && exists(data_series.unread_releases)) {
		series_row.setAttribute("new_releases", "true");
	} else series_row.setAttribute("new_releases", "false");

	var title_block = buildTitleBlock(data_list, data_series);
	var release_block = buildReleaseBlock(data_list, data_series);
	var button_block = buildButtonBlock(data_list, data_series);
	series_row.appendChild(title_block);
	series_row.appendChild(button_block);
	series_row.appendChild(release_block);
	series_row_wrap.appendChild(series_row);

	return series_row_wrap;
}

/**
 * builds DOM elements mimicing browser badge text
 * @param {number} num_releases
 */
function buildBadge(num_releases) {
	var badge = document.createElement('span');
	var badge_text = document.createElement('span');
	badge.className = "badge";
	badge_text.className = "badgeText";
	badge_text.textContent = num_releases.toString();
	badge.appendChild(badge_text);
	return badge;
}

/**
 * builds DOM element holding title, link and link button
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildTitleBlock(data_list, data_series) {
	var title_block = document.createElement('div');
	var title_disp = document.createElement('div');
	var title_cont = document.createElement('p');
	var title_link = document.createElement('a');
	title_block.className = "seriesTitleBlock";
	title_disp.className = "titleDisplay";
	title_cont.className = "titleContent";
	title_link.className = "titleLink";
	title_link.textContent = data_series.title;
	if (exists(data_series.user_link)) {
		title_link.setAttribute("user_link", data_series.user_link);
	} else {
		title_link.setAttribute("default_link", getDefaultLink(data_series.series_id));
	}
	title_link.onclick = handleTitleLink;

	var len = data_series.title.length;
	var font_size = 14;
	if (len > 50) font_size = 10;
	title_cont.style.fontSize = font_size + 'px';
	var edit_link_wrap = buildEditLinkButton(data_series);
	if (!isEmpty(data_series.unread_releases)) {
		if (data_series.unread_releases.length > 1) {
			var badge = buildBadge(data_series.unread_releases.length);
			var title_badge_wrap = document.createElement('div');
			badge.classList.add("titleBadge");
			title_badge_wrap.className = "titleBadgeWrap";
			title_badge_wrap.appendChild(badge);
			title_block.appendChild(title_badge_wrap);
		}
	}

	title_block.appendChild(title_disp);
	title_disp.appendChild(title_cont);
	title_cont.appendChild(title_link);
	title_block.appendChild(edit_link_wrap);

	return title_block;
}

/**
 * builds DOM button for editing link associated with selected series
 * @param {Series} data_series
 * @returns {Element}
 */
function buildEditLinkButton(data_series) {
	var edit_link_button = document.createElement("div");
	edit_link_button.className = "editLinkButton";
	edit_link_button.onclick = handleEnableEditLink;
	edit_link_button.title = "Edit Link";
	var edit_link_icon = document.createElement("div");
	edit_link_icon.className = "editLinkIcon";
	edit_link_icon.textContent = "\u26AD\uFE0E";
	var edit_link_wrap = document.createElement("div");
	edit_link_wrap.className = "editLinkWrap";
	if (!manageModeOn()) {
		edit_link_wrap.style.display = "none";
	}

	if (exists(data_series.user_link)) {
		edit_link_icon.style.opacity = 1;
		edit_link_button.style.opacity = .9;
	} 

	edit_link_button.appendChild(edit_link_icon);
	edit_link_wrap.appendChild(edit_link_button);

	return edit_link_wrap;
}

/**
 * builds DOM element with latest read/published release info for series
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildReleaseBlock(data_list, data_series) {
	var release_block = document.createElement('div');

	var release_line_disp = document.createElement('div');
	release_block.className = "seriesReleaseBlock";
	release_line_disp.className = "releaseLineDisplay";

	var release_read_line = buildReleaseReadLine(data_series);
	release_line_disp.appendChild(release_read_line);
	if (data_list.list_type === "read") {
		var release_latest_line = buildReleaseLatestLine(data_series);
		release_line_disp.appendChild(release_latest_line);
	} else if (data_list.list_type === "complete") {
		var date_line = document.createElement('div');
		var date = new Date(data_series.date_added).toDateString();
		date_line.textContent = "Date completed: " + date.substring(4);
		release_line_disp.appendChild(date_line);
	}		
	release_block.appendChild(release_line_disp);

	return release_block;
}

/**
 * builds DOM element with latest read release info
 * @param {Series} data_series
 * @returns {Element}
 */
function buildReleaseReadLine(data_series) {
	var release_read_line = document.createElement('div');
	var release_read_desc = document.createElement('span');
	var release_read_disp = document.createElement('span');
	var read_volume_desc = document.createElement('span');
	var read_volume = document.createElement('span');
	var read_chapter_desc = document.createElement('span');
	var read_chapter = document.createElement('span');
	var read_not_applic = document.createElement('span');
	release_read_line.className = "releaseReadLine";
	release_read_desc.className = "releaseReadDescription";
	release_read_disp.className = "releaseReadDisplay";
	read_volume_desc.className = 'readVolumeDescription';
	read_volume.className = 'readVolume';
	read_chapter_desc.className = 'readChapterDescription';
	read_chapter.className = 'readChapter';
	read_not_applic.className = 'readChapVolNA';
	read_volume.onclick = handleEnableReadReleaseEdit;
	read_chapter.onclick = handleEnableReadReleaseEdit;
	read_not_applic.onclick = handleEnableReadReleaseEdit;

	var volume = "";
	var chapter = "";


	if (!data_series.last_update_was_manual && !isEmpty(data_series.latest_read_release)) {
		volume = data_series.latest_read_release.volume;
		chapter = data_series.latest_read_release.chapter;
	}
	else {
		volume = data_series.mu_user_volume;
		chapter = data_series.mu_user_chapter;
	}
	read_volume_desc.textContent = "v. ";

	if (volume == "") {
		read_volume_desc.style.display = "none";
		read_volume.style.display = "none";
	} else read_volume.textContent = volume;

	read_chapter_desc.textContent = "c. ";
	if (chapter == "") {
		read_chapter_desc.style.display = "none";
		read_chapter.style.display = "none";
	} else read_chapter.textContent = chapter;

	read_not_applic.textContent = "n/a";
	read_not_applic.style.display = "none";
	if (volume == "" && chapter == "") read_not_applic.style.display = "";

	release_read_desc.textContent = "Latest Read: ";

	release_read_disp.appendChild(read_volume_desc);
	release_read_disp.appendChild(read_volume);
	release_read_disp.appendChild(read_chapter_desc);
	release_read_disp.appendChild(read_chapter);
	release_read_disp.appendChild(read_not_applic);

	release_read_line.appendChild(release_read_desc);
	release_read_line.appendChild(release_read_disp);

	return release_read_line;
}

/**
 * builds DOM element with latest known release info
 * @param {Series} data_series
 * @returns {Element}
 */
function buildReleaseLatestLine(data_series) {
	var release_latest_line = document.createElement('div');
	var release_latest_desc = document.createElement('span');
	var release_latest_disp = document.createElement('span');
	var latest_volume = "";
	var latest_chapter = "";

	release_latest_line.className = "releaseLatestLine";
	release_latest_desc.className = "releaseLatestDescription";
	release_latest_disp.className = "releaseLatestDisplay";

	release_latest_desc.textContent = "Latest Release: ";
	var latest_release_str = "n/a";
	var latest_release = getLatestRelease(data_series);

	if (!isEmpty(latest_release)) {
		var latest_volume_desc = "";
		var latest_chapter_desc = "";
		if (latest_release.volume !== "" && latest_release.chapter !== "") {
			latest_volume_desc = "v. ";
			latest_chapter_desc = " c. ";
		}
		else if (latest_release.volume !== "") {
			latest_volume_desc = "v. ";
		}
		else if (latest_release.chapter !== "") {
			latest_chapter_desc = "c. ";
		} else {
			latest_chapter_desc = "c. n/a";
		}
		latest_release_str = latest_volume_desc + latest_release.volume + latest_chapter_desc + latest_release.chapter;
	}
	release_latest_disp.textContent = latest_release_str;

	release_latest_line.appendChild(release_latest_desc);
	release_latest_line.appendChild(release_latest_disp);

	return release_latest_line;
}

/**
 * builds DOM element container for up-to-date and series select buttons,
 * the buttons which will be used most frequently by user
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildButtonBlock(data_list, data_series) {
	var button_block = document.createElement('div');
	button_block.className = "buttonBlock";
	if (data_list.list_type === "read") {
		var uptodate_button_wrap = buildUpToDateButton(data_series);
		button_block.appendChild(uptodate_button_wrap);
	}
	var series_select_button_wrap = buildSeriesSelectButton();
	button_block.appendChild(series_select_button_wrap);
	var latest_read = data_series.latest_read_release;


	return button_block;
}

/**
 * builds DOM button which updates the series when clicked by user
 * @param {Series} data_series
 * @returns {Element}
 */
function buildUpToDateButton(data_series) {
	var uptodate_button = document.createElement('div');
	var uptodate_button_wrap = document.createElement('div');
	uptodate_button_wrap.className = "upToDateButtonWrap";
	uptodate_button.className = 'upToDateButton';
	uptodate_button.onclick = handleUpToDateClicked;
	uptodate_button.textContent = "Mark\u00A0Up\u2011to\u2011Date";

	var latest_release = getLatestRelease(data_series);
	if (data_series.no_published_releases) {
		uptodate_button.setAttribute("up_to_date", "true");
		hideElement(uptodate_button);
	} else if (!data_series.last_update_was_manual && isEmpty(data_series.latest_unread_release)) {
		uptodate_button.style.display = "none";
		uptodate_button.setAttribute("up_to_date", "true");
	} else if (isEmpty(latest_release)) {
		uptodate_button.setAttribute("up_to_date", "unknown");
		if (!global_pref_one_click_uptodate.enabled) {
			uptodate_button.textContent = "Sync\u00A0Latest\u00A0Release";
		}
	} else {
		uptodate_button.setAttribute("up_to_date", "false");
	}
	if (manageModeOn()) {
		hideElement(uptodate_button);
	}

	uptodate_button_wrap.appendChild(uptodate_button);
	return uptodate_button_wrap;
}

/**
 * builds DOM element for making series selection for user series management
 * @returns {Element}
 */
function buildSeriesSelectButton() {
	var series_select_button = document.createElement('div');
	var series_select_wrap = document.createElement('div');
	series_select_wrap.className = "seriesSelectWrap";
	series_select_button.className = "seriesSelectButton";
	series_select_button.setAttribute("toggle", "off");
	series_select_button.onclick = handleSeriesSelect;
	if (!manageModeOn()) {
		series_select_wrap.style.display = "none";
	}
	series_select_wrap.appendChild(series_select_button);
	return series_select_wrap;
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
			active: true, url: "https://www.mangaupdates.com/" }, function () {
			if (chrome.runtime.lastError) {
				console.error("Failed to load login page: " + chrome.runtime.lastError.message);
			}
		})
	});

	redirect_register.onclick = (function () {
		chrome.tabs.create({
			active: true, url: "https://www.mangaupdates.com/signup.html" }, function () {
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

