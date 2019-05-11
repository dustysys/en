/*#############################################################################
File: pop_release_builder.js

These functions build DOM elements composing the Release display state, this
means a table filled with release rows created from releases stored by each 
Series. Handlers for interacting with the rows are also attached here.
#############################################################################*/


/**
 * builds DOM element which contains all the rows for each release
 * @param {List} data_list
 * @returns {Element}
 */
function buildReleaseTable(data_list) {
	var releaseTable = document.createElement("div");
	releaseTable.className = "releaseTable";
	releaseTable.setAttribute("list_id", data_list.list_id);
	releaseTable.setAttribute("list_type", data_list.list_type);
    var s_list = data_list.series_list;
    var r_rowlist = [];
	for (var i = 0; i < s_list.length; i++) {
        for (var j = 0; j < s_list[i].unread_releases.length; j++) {
			var release_row = buildReleaseRow(data_list, s_list[i], s_list[i].unread_releases[j]);
			r_rowlist.push(release_row);
        }
    }

    r_rowlist.sort(cmpReleaseRowPopupUpdateOrder);
    for (var i = 0; i < r_rowlist.length; i++) {
		releaseTable.appendChild(r_rowlist[i]);
	}

	return releaseTable;
}

/**
 * Sort method to display release rows in
 * @param {Element} a 
 * @param {Element} b 
 */
function cmpReleaseRowPopupUpdateOrder(a,b) {
	// unwrap release row
	let release1_row = a.querySelector('.releaseRow');
	let release2_row = b.querySelector('.releaseRow');
	let release1_str = getReleaseRowsId(release1_row);
	let release2_str = getReleaseRowsId(release2_row);
	let release1_date = release1_row.getAttribute("release_date");
	let release2_date = release2_row.getAttribute("release_date");
	let release1_title = release1_row.getAttribute("release_title");
	let release2_title = release2_row.getAttribute("release_title");
	let title_cmp = cmpAlphabetical(release1_title, release2_title);
	let release_cmp = cmpAlphabetical(release1_str, release2_str);
	let date_cmp = cmp_date(release1_date, release2_date);
	if (title_cmp != 0) {
		return title_cmp;
	} else if ( date_cmp != 0 ) {
		return date_cmp;
	} else return release_cmp;
}

/**
 * builds DOM element that encapsulates all info and editing capacity for
 * a release, this composes most the release tab
 * @param {List} data_list
 * @param {Series} data_series
 * @param {Release} release
 * @returns {Element}
 */
function buildReleaseRow(data_list, data_series, release) {
	var release_row_wrap = document.createElement('div');
	release_row_wrap.className = "releaseRowWrap";
	var release_row = document.createElement('div');
	release_row.className = "releaseRow";
	var release_str = release.groups + release.volume + release.chapter + release.date;
	release_row.setAttribute("list_id", data_list.list_id);
	release_row.setAttribute("series_id", "s" + data_series.series_id);
	release_row.setAttribute("release_id", "r" + release_str);
	release_row.setAttribute("release_date", release.date);
	release_row.setAttribute("release_title", release.title);
	release_row.setAttribute("new_releases", "true");
	var title_block = buildReleaseRowTitleBlock(data_list, data_series, release);
	var release_block = buildReleaseRowReleaseBlock(data_list, data_series, release);
	//var button_block = buildReleaseRowButtonBlock(data_list, data_series, release);
	release_row.appendChild(title_block);
	//release_row.appendChild(button_block);
	release_row.appendChild(release_block);
	release_row_wrap.appendChild(release_row);

	return release_row_wrap;
}

/**
 * builds DOM element holding title
 * @param {List} data_list
 * @param {Series} data_series
 * @param {Release} release
 * @returns {Element}
 */
function buildReleaseRowTitleBlock(data_list, data_series, release) {
	var title_block = document.createElement('div');
	var title_disp = document.createElement('div');
	var title_cont = document.createElement('p');
	var title_link = document.createElement('a');
	title_block.className = "releaseRowTitleBlock";
	title_disp.className = "titleDisplay";
	title_cont.className = "titleContent";
	title_link.className = "titleLink";
	title_link.textContent = release.title;
	if (exists(data_series.user_link)) {
		title_link.setAttribute("user_link", data_series.user_link);
	} else {
		title_link.setAttribute("default_link", getDefaultLink(data_series.series_id));
	}
	title_link.onclick = handleTitleLink;

	var len = release.title.length;
	var font_size = 14;
	if (len > 50) font_size = 10;
	title_cont.style.fontSize = font_size + 'px';

	title_block.appendChild(title_disp);
	title_disp.appendChild(title_cont);
	title_cont.appendChild(title_link);

	return title_block;
}

/**
 * builds DOM element displaying all info for the release
 * @param {List} data_list
 * @param {Series} data_series
 * @param {Release} release
 * @returns {Element}
 */
function buildReleaseRowReleaseBlock(data_list, data_series, release) {
	var release_block = document.createElement('div');
	var release_volchap_disp = document.createElement('div');
	var release_groups_disp = document.createElement('div');
	var release_date_disp = document.createElement('div');
	var release_volchap_line = buildReleaseVolChapLine(release);
	var release_groups_line = buildReleaseGroupsLine(release);
	var release_date_line = buildReleaseDateLine(release);
	release_block.className = "releaseRowReleaseBlock";
	release_volchap_disp.className = "releaseVolChapDisplay";
	release_groups_disp.className = "releaseGroupsDisplay";
	release_date_disp.className = "releaseDateDisplay";

	release_volchap_disp.appendChild(release_volchap_line);
	release_groups_disp.appendChild(release_groups_line);
	release_date_disp.appendChild(release_date_line);

	release_block.appendChild(release_volchap_disp);
	release_block.appendChild(release_groups_disp);
	release_block.appendChild(release_date_disp);

	return release_block;
}

/**
 * builds DOM element displaying volume/chapter for release
 * @param {Release} release
 * @returns {Element}
 */
function buildReleaseVolChapLine(release) {
	var volchap_line = document.createElement('div');
	var volchap_desc = document.createElement('span');
	var volchap_disp = document.createElement('span');
	var volume = release.volume;
	var chapter = release.chapter;

	volchap_line.className = "releaseVolChapLine";
	volchap_desc.className = "releaseVolChapDescription";
	volchap_disp.className = "releaseVolChapDisplay";

	volchap_desc.textContent = "Release: ";

	var volume_desc = "";
	var chapter_desc = "";
	if (volume !== "" && chapter !== "") {
		volume_desc = "v. ";
		chapter_desc = " c. ";
	}
	else if (volume !== "") {
		volume_desc = "v. ";
	}
	else if (release.chapter !== "") {
		chapter_desc = "c. ";
	} else {
		chapter_desc = "c. n/a";
	}
	volchap_release_str = volume_desc + volume + chapter_desc + chapter;

	volchap_disp.textContent = volchap_release_str;

	volchap_line.appendChild(volchap_desc);
	volchap_line.appendChild(volchap_disp);

	return volchap_line;

}

/**
 * builds DOM element displaying group for release
 * @param {Release} release
 * @returns {Element}
 */
function buildReleaseGroupsLine(release){
	var groups_line = document.createElement('div');
	var groups_desc = document.createElement('span');
	var groups_disp = document.createElement('span');

	groups_line.className = "releaseGroupsLine";
	groups_desc.className = "releaseGroupsDescription";
	groups_disp.className = "releaseGroupsDisplay";
	
	groups_desc.textContent = "Group: ";
	if ( release.groups.includes('&') ) {
		groups_desc.textContent = "Groups: ";
	} 

	groups_disp.textContent = release.groups;

	groups_line.appendChild(groups_desc);
	groups_line.appendChild(groups_disp);

	return groups_line;
}

/**
 * builds DOM element displaying date of release
 * @param {Release} release
 * @returns {Element}
 */
function buildReleaseDateLine(release){
	var date_line = document.createElement('div');
	var date_desc = document.createElement('span');
	var date_disp = document.createElement('span');

	date_line.className = "releaseDateLine";
	date_desc.className = "releaseDateDescription";
	date_disp.className = "releaseDateDisplay";

	var date = release.date.substring(0,10);
	date_desc.textContent = "Date: ";
	date_disp.textContent = date;

	date_line.appendChild(date_desc);
	date_line.appendChild(date_disp);

	return date_line;
}