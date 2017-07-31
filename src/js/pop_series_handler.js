/*#############################################################################
File: pop_series_handler.js

These handlers determine the immediate course of action upon an input event
from the user when in the series display state. If a handler needs additional
processing or access to data it will escalate to calling an action function.
#############################################################################*/

/**
 * moves uptodate button slightly to indicate it was clicked and
 * calls the uptodate handler to determine next action
 * @param {Event} event
 * @param {function(event)} callback
 */
function handleUpToDateClicked(event, callback) {
	fastdom.mutate(function () {
		event.target.style.transform = "translateY(1px)";
		setTimeout(function () {
			fastdom.mutate(function () {
				event.target.style.transform = "translateY(0px)";
				callback(event);
			});
		}, 50);
	});
}

/**
 * toggles series select and handles shift-click functionality
 * @param {Event} event
 */
function handleSeriesSelect(event) {
	var last_clicked = pop.last_clicked_el;
	if (!event.shiftKey || last_clicked === event.target) {
		var tog = toggleElement(event.target);
		if (!tog) resetSelectAllSeriesButton();
	} else if (last_clicked !== event.target && last_clicked.className === "seriesSelectButton") {
		var vis_rows = getVisibleSeriesRows();
		var vis_select_buttons = [];
		var index1_found = false;
		var index1;
		var index2;
		for (var i = 0; i < vis_rows.length; i++) {
			vis_select_buttons.push(vis_rows[i].querySelectorAll(".seriesSelectButton")[0]);
		}
		for (var i = 0; i < vis_select_buttons.length; i++) {
			if (vis_select_buttons[i] === last_clicked || vis_select_buttons[i] === event.target) {
				if (!index1_found) {
					index1 = i;
					index1_found = true;
				} else {
					index2 = i;
					break;
				}
			}
		}
		for (var i = index1 + 1; i < index2; i++) {
			toggleElement(vis_select_buttons[i]);
		}
		toggleElement(event.target);
	}
}

/**
 * checks to see if user is done editing volume/chapter input. if so,
 * it triggers a check to see if it needs updated
 * @param {Event} event
 */
function handleCompleteReadReleaseEdit(event) {
	var root = getReleaseFieldsReleaseDisplay(event.target);
	var vol_input = root.children[1];
	var chap_input = root.children[4];

	// tiny delay to let user switch between volume/chapter input without losing context
	setTimeout(function () {
		var field_focused = false;
		if (document.activeElement === vol_input || document.activeElement === chap_input) {
			field_focused = true;
		}

		if (!field_focused) {
			var series_row = getReleaseFieldsSeriesRow(root);
			handleUserMUReadUpdate(series_row, vol_input, chap_input);
		}
	}, 1);
}

/**
 * makes inputs for volume and chapter visible to user upon
 * clicking the text showing their current values
 * @param {Event} event
 */
function handleEnableReadReleaseEdit(event) {
	var clicked = event.target;
	var vol_focus = false;

	if (clicked.className === "readVolume") {
		vol_focus = true;
	}

	var root = getReleaseFieldsReleaseDisplay(clicked);
	var volume_desc = root.children[0];
	var volume = root.children[1];
	var chapter_desc = root.children[2];
	var chapter = root.children[3];
	var not_applic = root.children[4];

	volume_desc.style.display = "";
	volume.style.display = "none";
	chapter_desc.style.display = "";
	chapter.style.display = "none";
	not_applic.style.display = "none";

	var vol_input = document.createElement('input');
	var chap_input = document.createElement('input');
	vol_input.type = "text";
	vol_input.className = "readVolumeInput";
	vol_input.maxLength = 100;

	chap_input.type = "text";
	chap_input.className = "readChapterInput";
	chap_input.maxLength = 100;

	vol_input.onblur = handleCompleteReadReleaseEdit;
	chap_input.onblur = handleCompleteReadReleaseEdit;

	root.insertBefore(vol_input, volume);
	root.insertBefore(chap_input, chapter);

	if (vol_focus) {
		vol_input.focus();
	} else chap_input.focus();

	vol_input.value = volume.textContent;
	chap_input.value = chapter.textContent;
}

/**
 * Opens the link associated with the series title clicked by user
 * @param {Event} event
 */
function handleTitleLink(event) {
	if (event.target.hasAttribute("user_link")) {
		var user_link = event.target.getAttribute("user_link");
		if (!isEmpty(user_link)) {
			chrome.tabs.create({ active: true, url: user_link }, function () {
				if (chrome.runtime.lastError) {
					console.error("Failed to load user url: " + chrome.runtime.lastError.message);
				}
			});
		}
	} else if (event.target.hasAttribute("default_link")) {
		var default_link = event.target.getAttribute("default_link");
		chrome.tabs.create({ active: true, url: default_link }, function () {
			if (chrome.runtime.lastError) {
				console.error("Failed to load default url: " + chrome.runtime.lastError.message);
			}
		});
	}
}

/**
 * enters the link provided by user into series' model and removes the input
 * on clicking away from it
 * @param {Event} event
 */
function handleCompleteEditLink(event) {
	var input_link = event.target;
	var link = input_link.value;
	var link_is_empty = (link === "");
	var series_row = getInputLinksSeriesRow(input_link);
	var series_id = getSeriesRowsId(series_row);
	var title_link = getSeriesRowsTitleLink(series_row);

	if (link_is_empty && !title_link.hasAttribute("user_link")) {
		//do nothing
	} else {
		var link_button = getSeriesRowsEditLinkButton(series_row);
		var link_icon = getEditLinkButtonsLinkIcon(link_button);

		if (link_is_empty) {
			var default_link = getDefaultLink(series_id);
			userClearSeriesLink(series_id);
			title_link.removeAttribute("user_link");
			title_link.setAttribute("default_link", default_link);
			link_button.style.removeProperty("opacity");
			link_icon.style.removeProperty("opacity");
		} else {
			link = validateUrl(link);
			userSetSeriesLink(series_id, link);
			title_link.setAttribute("user_link", link);
			link_button.style.opacity = .97;
			link_icon.style.opacity = 1;
		}
	}
	input_link.parentElement.removeChild(input_link);
}

/**
 * creates the textbox to enter custom series link
 * @param {Event} event
 */
function handleEnableEditLink(event) {
	var edit_link_input = document.createElement('input');
	edit_link_input.type = "text";
	edit_link_input.className = "editLinkInput";
	edit_link_input.placeholder = "Paste link here";
	edit_link_input.maxLength = 1000;
	edit_link_input.onblur = handleCompleteEditLink;
	var title_block;
	if (event.target.className === "editLinkIcon") {
		title_block = getEditLinkIconsTitleBlock(event.target);
	} else if (event.target.className === "editLinkButton") {
		title_block = getEditLinkButtonsTitleBlock(event.target);
	} else return;
	var title_link = getTitleBlocksTitleLink(title_block);
	if (title_link.hasAttribute("user_link")) {
		edit_link_input.value = title_link.getAttribute("user_link");
	}
	title_block.appendChild(edit_link_input);
	edit_link_input.focus();
}

/**
 * marks a series' releases seen when alt-clicked
 * @param {Event} event
 */
function handleClickedSeriesRow(event) {
	if (event.altKey) {
		var series_row = event.target.closest('.seriesRow');
		var series_id = getSeriesRowsId(series_row);
		var list_id = series_row.getAttribute("list_id");
		userMarkSeriesReleasesSeen(getSeriesRowsId(series_row), function (data) {
			var series = getSeriesById(data.lists, series_id);
			var list = getListById(data.lists, list_id);
			var updated_row = updateSeriesRow(series_row, list, series);
			finalizeMarkSeriesRowUpToDate(updated_row);
		});
	}
}

