/*#############################################################################
File: pop_options_handler.js

These are the handlers for when a user gives input in the option display
state.
#############################################################################*/

/**
 * saves the scrollbar visibility preference on select toggle
 * @param {Event} event
 */
function handleToggleScrollbar(event) {
	var toggle = toggleElement(event.target);
	var scroll_pref;
	if (toggle) {
		document.body.classList.remove("noScroll");
		scroll_pref = { enabled: true };
	} else {
		document.body.className = "noScroll";
		scroll_pref = { enabled: false };
	}
	savePref("scrollbar", scroll_pref);
	global_pref_scrollbar = scroll_pref;
	popupUpdatePrefs();
}

/**
 * saves whether animations are enabled on select toggle
 * also switches color to avoid bad contrast when color
 * transitions are turned off
 * @param {Event} event
 */
function handleToggleAnimations(event) {
	var toggle = toggleElement(event.target);
	var anim_pref;
	if (toggle) {
		anim_pref = { enabled: true};
	} else {
		anim_pref = { enabled: false };
	}
	animateToggleOptionPage(toggle);
	savePref("animations", anim_pref);
	global_pref_animations = anim_pref;
	popupUpdatePrefs();
}

/**
 * saves the #-click mode on select toggle
 * @param {Event} event
 */
function handleToggleOneClick(event) {
	var toggle = toggleElement(event.target);
	var oneclick_pref;
	if (toggle) {
		oneclick_pref = { enabled: true };
	} else {
		oneclick_pref = { enabled: false };
	}
	savePref("one_click_uptodate", oneclick_pref);
	global_pref_one_click_uptodate = oneclick_pref;
	unloadAllLists();
	popupUpdatePrefs();
}

/**
 * saves whether release updates are enabled by select toggle
 * @param {Event} event
 */
function handleToggleReleaseUpdates(event) {
	var edit_text = getOptionSelectsEditText(event.target);
	var toggle = toggleElement(event.target);
	var release_update_pref;
	var edit_text_val = parseInt(edit_text.textContent);
	if (toggle) {
		release_update_pref = { enabled: true, interval: edit_text_val };
	} else {
		release_update_pref = { enabled: false, interval: edit_text_val  };
	}
	toggleReleaseUpdateTextDisplay(toggle);
	savePref("release_update", release_update_pref);
	global_pref_release_update = release_update_pref;
	popupUpdatePrefs();
}

/**
 * hides/shows release update interval text
 * @param {boolean} toggle
 */
function toggleReleaseUpdateTextDisplay(toggle) {
	var release_update_disp = document.getElementsByClassName("releaseUpdateDisplay")[0];
	toggleElementVisibility(release_update_disp, toggle);
}

/**
 * saves whether sync is enabled on select toggle
 * @param {Event} event
 */
function handleToggleSync(event) {
	var edit_text = getOptionSelectsEditText(event.target);
	var toggle = toggleElement(event.target);
	var list_sync_pref;
	var edit_text_val = parseInt(edit_text.textContent);
	if (toggle) {
		list_sync_pref = { enabled: true, interval: edit_text_val };
	} else {
		list_sync_pref = { enabled: false, interval: edit_text_val };
	}
	toggleSyncTextDisplay(toggle);
	savePref("list_sync", list_sync_pref);
	global_pref_list_sync = list_sync_pref;
	popupUpdatePrefs();
}

/**
 * hides/shows sync interval text
 * @param {boolean} toggle
 */
function toggleSyncTextDisplay(toggle) {
	var sync_disp = document.getElementsByClassName("syncDisplay")[0];
	toggleElementVisibility(sync_disp, toggle);
}

/**
 * saves notification setting on select toggle
 * @param {Event} event
 */
function handleToggleNotifications(event) {
	var toggle = toggleElement(event.target);
	var notif_pref;
	if (toggle) {
		notif_pref = { enabled: true };
	} else {
		notif_pref = { enabled: false };
	}
	savePref("notifications", notif_pref);
	global_pref_notifications = notif_pref;
	popupUpdatePrefs();
}

/**
 * saves the update interval when user clicks away from input
 * @param {Event} event
 */
function handleCompleteReleaseUpdateIntervalEdit(event) {
	var edit_input = event.target;
	var edit_text = edit_input.nextElementSibling;
	var edit_input_val = parseInt(validateDigits(edit_input.value));
	if (isNaN(edit_input_val) || edit_input_val < 1) {
		edit_input_val = 1;
	}
	edit_text.textContent = edit_input_val.toString();
	var opt_select = getEditTextsOptionSelect(edit_text);
	var opt_select_on = opt_select.getAttribute("toggle") === "on";
	var release_update_pref = { enabled: opt_select_on, interval: edit_input_val };
	savePref("release_update", release_update_pref);
	global_pref_release_update = release_update_pref;
	edit_input.parentElement.removeChild(edit_input);
	edit_text.style.display = "";
	popupUpdatePrefs();
}

/**
 * saves the sync interval when user clicks away from input
 * @param {Event} event
 */
function handleCompleteSyncIntervalEdit(event) {
	var edit_input = event.target;
	var edit_text = edit_input.nextElementSibling;
	var edit_input_val = parseInt(validateDigits(edit_input.value));
	if (isNaN(edit_input_val) || edit_input_val < 1) {
		edit_input_val = 1;
	}
	edit_text.textContent = edit_input_val.toString();
	var opt_select = getEditTextsOptionSelect(edit_text);
	var opt_select_on = opt_select.getAttribute("toggle") === "on";
	var sync_pref = { enabled: opt_select_on, interval: edit_input_val };
	savePref("list_sync", sync_pref);
	global_pref_list_sync = sync_pref;
	edit_input.parentElement.removeChild(edit_input);
	edit_text.style.display = "";
	popupUpdatePrefs();
}

/**
 * opens an input box when the user clicks the
 * update interval text
 * @param {Event} event
 */
function handleEnableReleaseUpdateIntervalEdit(event) {
	var edit_text = event.target;
	var edit_input = document.createElement('input');
	edit_input.className = "optionInput";
	edit_input.type = "text";
	edit_input.maxLength = 4;
	edit_text.style.display = "none";
	edit_text.parentElement.insertBefore(edit_input, edit_text);
	edit_input.value = edit_text.textContent;
	edit_input.focus();
	edit_input.onblur = handleCompleteReleaseUpdateIntervalEdit;
}

/**
 * opens an input box when the user clicks the
 * sync interval text
 * @param {Event} event
 */
function handleEnableSyncIntervalEdit(event) {
	var edit_text = event.target;
	var edit_input = document.createElement('input');
	edit_input.className = "optionInput";
	edit_input.type = "text";
	edit_input.maxLength = 4;
	edit_text.style.display = "none";
	edit_text.parentElement.insertBefore(edit_input, edit_text);
	edit_input.value = edit_text.textContent;
	edit_input.focus();
	edit_input.onblur = handleCompleteSyncIntervalEdit;
}