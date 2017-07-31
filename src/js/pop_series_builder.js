/*#############################################################################
File: pop_series_builder.js

These functions build DOM elements composing the Series display state, this
means a table filled with series rows based on a List and its Series. It
displays basic information about the latest read/published Releases as well.
Handlers for interacting with the rows are also attached here.
#############################################################################*/

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
	s_list.sort(cmpSeriesPopupUpdateOrder);
	for (var i = 0; i < s_list.length; i++) {
		var series_row = buildSeriesRow(data_list, s_list[i]);
		list_table.appendChild(series_row);
	}

	return list_table;
}

/**
 * determines if series row has unread releases which have not been
 * marked as seen already
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {boolean}
 */
function seriesRowHasNewReleases(data_list, data_series) {
	if (data_list.list_type === "read") {
		if (exists(data_series.latest_unread_release)) {
			return !data_series.latest_unread_release.marked_seen;
		}
	}
	return false;
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
	series_row.onclick = handleClickedSeriesRow;
	if (seriesRowHasNewReleases(data_list, data_series)){
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
	badge_text.title = num_releases + " unread releases";
	if (num_releases === 1) badge_text.title = "1 unread release";
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
		if (data_series.unread_releases.length > 1 || data_series.latest_unread_release.marked_seen) {
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
	if (data_list.list_type === "read") return buildReadReleaseBlock(data_list, data_series);
	if (data_list.list_type === "wish") return buildWishReleaseBlock(data_list, data_series);
	if (data_list.list_type === "complete") return buildCompleteReleaseBlock(data_list, data_series);
	var release_block = document.createElement('div');
	var release_line_disp = document.createElement('div');
	var release_read_line = buildReleaseReadLine(data_series);
	release_block.className = "seriesReleaseBlock";
	release_line_disp.className = "releaseLineDisplay";
	release_line_disp.appendChild(release_read_line);
	release_block.appendChild(release_line_disp);

	return release_block;
}

/**
 * build release block for lists of type 'read'. It is the only
 * list type which shows the latest published release
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildReadReleaseBlock(data_list, data_series) {
	var release_block = document.createElement('div');
	var release_line_disp = document.createElement('div');
	var release_read_line = buildReleaseReadLine(data_series);
	var release_latest_line = buildReleaseLatestLine(data_series);
	release_block.className = "seriesReleaseBlock";
	release_line_disp.className = "releaseLineDisplay";
	release_line_disp.appendChild(release_read_line);
	release_line_disp.appendChild(release_latest_line);
	release_block.appendChild(release_line_disp);

	return release_block;
}

/**
 * build release block for lists of type 'wish'. It only has
 * the date added to the wish list.
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildWishReleaseBlock(data_list, data_series) {
	var release_block = document.createElement('div');
	var release_line_disp = document.createElement('div');
	var date_line = document.createElement('div');
	var date = new Date(data_series.date_added).toDateString();
	release_block.className = "seriesReleaseBlock";
	release_line_disp.className = "releaseLineDisplay";
	date_line.className = "dateLine";
	date_line.textContent = "Date added: " + date.substring(4);
	release_line_disp.appendChild(date_line);
	release_block.appendChild(release_line_disp);

	return release_block;
}

/**
 * build release block for lists of type 'complete'
 * It has the latest release read and a date completed (when it
 * was added to the complete list)
 * @param {List} data_list
 * @param {Series} data_series
 * @returns {Element}
 */
function buildCompleteReleaseBlock(data_list, data_series) {
	var release_block = document.createElement('div');
	var release_line_disp = document.createElement('div');
	var release_read_line = buildReleaseReadLine(data_series);
	var date_line = document.createElement('div');
	var date = new Date(data_series.date_added).toDateString();
	release_block.className = "seriesReleaseBlock";
	release_line_disp.className = "releaseLineDisplay";
	date_line.className = "dateLine";
	date_line.textContent = "Date completed: " + date.substring(4);
	release_line_disp.appendChild(release_read_line);
	release_line_disp.appendChild(date_line);
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
 * determines whether a series is up to date as it relates to the
 * functionality of the up-to-date button. 
 * @param {Series} data_series
 * @returns {string}
 */
function getUpToDateButtonStatus(data_series) {
	var latest_release = getLatestRelease(data_series);
	var latest_unread = data_series.latest_unread_release;
	var uptodate_status = "false";
	if (data_series.no_published_releases) {
		uptodate_status = "true";
	} else if (!data_series.last_update_was_manual && !exists(latest_unread)) {
		uptodate_status = "true";
	} else if (!exists(latest_release)) {
		uptodate_status = "unknown";
	} 

	return uptodate_status;
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
	uptodate_button.onclick = (function (event) { handleUpToDateClicked(event, handleUpToDate); });
	uptodate_button.textContent = "Mark\u00A0Up\u2011to\u2011Date";

	var uptodate_status = getUpToDateButtonStatus(data_series);
	uptodate_button.setAttribute("up_to_date", uptodate_status);
	if (uptodate_status === "true") {
		uptodate_button.style.display = "none";
	} else if (uptodate_status === "unknown") {
		if (!global_pref_one_click_uptodate.enabled) {
			uptodate_button.textContent = "Sync\u00A0Latest\u00A0Release";
		}
	}

	if (manageModeOn()) {
		uptodate_button.style.display = "none";
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