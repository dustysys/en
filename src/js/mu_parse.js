

function parseMyListPageForLists(list_page) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(list_page, "text/html");
	var elms = doc.querySelectorAll('[href^="https://www.mangaupdates.com/mylist.html?list="]');
	var parsed_lists = [];
	for (var i = 0; i < elms.length; i++) {
		var link = elms[i].getAttribute("href");
		var list_id = link.substring(link.indexOf("=") + 1);
		var list_name = elms[i].firstElementChild.textContent;
		var parsed_list = {
			list_id: list_id,
			list_name: list_name,
			list_type: "",
			series_list: []
		};
			parsed_lists.push(parsed_list);
	}
	return parsed_lists;
}

function parseEditListPageForTypes(edit_list_page) {
	var list_id_type_pairs = [];
	var edit_list_parser = new DOMParser();
	var edit_list_doc = edit_list_parser.parseFromString(edit_list_page, "text/html");
	var select_elms = edit_list_doc.getElementsByTagName('select');
	for (var i = 0; i < select_elms.length; i++) {
		var select_name = select_elms[i].name;
		if (select_name.includes("][type]")) {
			var list_num = parseInt(select_name.substring(6, select_name.indexOf("][type]")));
			var selected_type = select_elms[i].querySelector('[selected="selected"]');
			var list_id = getListIdByEnum(list_num);
			var list_type = selected_type.value;
			list_id_type_pairs.push([list_id, list_type]);
		}
	}
	return list_id_type_pairs;
}

function parseMembersPageForUserId(members_page) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(members_page, "text/html");
	var login_box = doc.getElementById("login_box_padding");
	var user_page_link = login_box.children[0].getAttribute("href");
	if (exists(user_page_link)) {
		var user_id = user_page_link.substring(user_page_link.indexOf("=") + 1);
		return user_id;
	} else return null;
}

function parseSeriesInfoPageForTitle(series_page) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(series_page, "text/html");
	var title_elms = doc.getElementsByClassName("releasestitle tabletitle");
	var title = title_elms[0].textContent;
	return title;
}

function parseSeriesReleasePageForLatestRelease(release_page) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(release_page, "text/html");
	var elm_list = doc.querySelector('[title="Series Info"]');
	if (elm_list) {

		var elm_title = elm_list;
		var elm_date = elm_title.parentElement.previousElementSibling;
		var elm_volume = elm_list.parentElement.nextElementSibling;
		var elm_chapter = elm_volume.nextElementSibling;
		var elm_groups = elm_chapter.nextElementSibling;

		var default_date = new Date(1970, 1, 1);
		var r_date = default_date.toISOString();
		if (validateDigits(elm_date.textContent) !== "") {
			var actual_date = new Date(elm_date.textContent);
			r_date = actual_date.toISOString();
		}
		var r_title = elm_title.textContent;
		var r_volume = elm_volume.textContent;
		var r_chapter = elm_chapter.textContent;
		var r_groups = "";

		for (var j = 0; j < elm_groups.children.length; j++) {
			if (j == 0) r_groups += elm_groups.children[0].textContent;
			else {
				r_groups += " & " + elm_groups.children[j].textContent;
			}
		}
		var release = {
			date: r_date,
			title: r_title,
			volume: r_volume,
			chapter: r_chapter,
			groups: r_groups,
			marked_seen: false
		};
		return release;

	} else return null;
}

function listPageIsPrimed(list_page) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(list_page, "text/html");
	var alpha_select = doc.querySelector('[value=alpha]');
	var perpage_option = doc.querySelector('[value="All"]');
	if (!alpha_select.hasAttribute('checked') || !perpage_option.hasAttribute('selected')) {
		return false;
	} else return true;
}

function parseListPageForSeriesList(list_page, existing_list) {
	var s_list = [];
	var parser = new DOMParser();
	var doc = parser.parseFromString(list_page, "text/html");
	var rows = doc.getElementsByClassName("lrow");
	for (var i = 0; i < rows.length; i++) {
		var s_url = rows.item(i).children[1].children[0].getAttribute("href");
		var id = s_url.substring(s_url.indexOf("=") + 1);

		var s_title = rows.item(i).children[1].children[0].children[0].textContent;
		var vol_digit = "";
		var chap_digit = "";
		var date = "";
		if (existing_list.list_type === "read") {
			var volume = rows.item(i).children[2].children[1].children[0].children[0].textContent;
			var chapter = rows.item(i).children[2].children[2].children[0].children[0].textContent;
			vol_digit = validateDigits(volume);
			chap_digit = validateDigits(chapter);
		}
		else if (existing_list.list_type === "wish" || existing_list.list_type === "complete") {
			date = rows.item(i).children[2].textContent;
			date = date.replace(/(\d+)(st,|nd,|rd,|th,)/, "$1");
			date = (new Date(date).toISOString());
		}
		else if (existing_list.list_type === "unfinished" || existing_list.list_type === "hold") {
			var vol_chap = rows.item(i).children[2].textContent;
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
	return s_list;
}

function parseNewReleasesPageForReleases(new_releases_page, latest_release_update) {
	var series_id_release_pairs = [];
	var parser = new DOMParser();
	var doc = parser.parseFromString(new_releases_page, "text/html");
	var elm_date_list = doc.querySelectorAll('[style="display:inline"]');
	if (elm_date_list && elm_date_list.length > 0) {
		for (var i = 0; i < elm_date_list.length; i++) {
			var elm_date = elm_date_list[i].firstElementChild;
			var str_date = elm_date.textContent;
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

					var r_title = elm_title.textContent;
					var r_vol_chap = elm_vol_chap.textContent;
					var r_volume = "";
					var r_chapter = "";
					var r_groups = "";

					var vol_indicators = instancesOf(elm_vol_chap.textContent, "v.", true);
					var chap_indicators = instancesOf(elm_vol_chap.textContent, "c.", true);
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
						if (k == 0) r_groups += elm_groups.children[0].textContent;
						else {
							r_groups += " & " + elm_groups.children[k].textContent;
						}
					}

					var release = {
						date: r_date,
						title: r_title,
						volume: r_volume,
						chapter: r_chapter,
						groups: r_groups,
						marked_seen: false
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

	return series_id_release_pairs;
}