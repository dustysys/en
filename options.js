// file for options composition and handling

function getOptionSelectsEditText(opt_select) {
	return opt_select.nextElementSibling.children[1];
}

function getEditTextsOptionSelect(edit_text) {
	return edit_text.parentElement.previousElementSibling;
}

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

function handleToggleAnimations(event) {
	var toggle = toggleElement(event.target);
	var anim_pref;
	if (toggle) {
		anim_pref = { enabled: true};
	} else {
		anim_pref = { enabled: false };
	}
	savePref("animations", anim_pref);
	global_pref_animations = anim_pref;
	popupUpdatePrefs();
}

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
	savePref("release_update", release_update_pref);
	global_pref_release_update = release_update_pref;
	popupUpdatePrefs();
}

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
	savePref("list_sync", list_sync_pref);
	global_pref_list_sync = list_sync_pref;
	popupUpdatePrefs();
}

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

function buildOptionsButton() {
	var opt_button = document.createElement('div');
	opt_button.id = "optionsButton";
	opt_button.className = "enButton";
	opt_button.onclick = handleToggleOptions;
	opt_button.textContent = "Options";
	opt_button.setAttribute("toggle", "off");

	return opt_button;
}

function buildOptionTable() {
	var opt_table = document.createElement('div');
	opt_table.className = "optionTable";
	opt_table.appendChild(buildOptionRow("scrollbar"));
	opt_table.appendChild(buildOptionRow("animations"));
	opt_table.appendChild(buildOptionRow("one_click_uptodate"));
	opt_table.appendChild(buildOptionRow("release_update"));
	opt_table.appendChild(buildOptionRow("list_sync"));
	opt_table.appendChild(buildOptionRow("notifications"));

	return opt_table;
}

function buildOptionRow(pref_desc) {
	var opt_row = document.createElement('div');
	opt_row.className = "optionRow";
	var desc_block = buildDescriptionBlock(pref_desc);
	var opt_block = buildOptionBlock(pref_desc);
	opt_row.appendChild(desc_block);
	opt_row.appendChild(opt_block);
	return opt_row;
}

function buildDescriptionBlock(pref_desc) {
	var desc_block = document.createElement('div');
	var desc_title = document.createElement('div');
	var desc_content = document.createElement('div');
	desc_block.className = "descriptionBlock";
	desc_title.className = "descriptionTitle";
	desc_content.className = "descriptionContent";
	var txt_title;
	var txt_content;

	switch (pref_desc) {
		case "scrollbar":
			txt_title = "Scrollbar";
			txt_content = "Show the scrollbar.";
			break;
		case "animations":
			txt_title = "Animations";
			txt_content = "Play transition animations in various contexts,\
							such as when you switch to Manage Series\
							mode or mark a series Up-to-Date.";
			break;
		case "one_click_uptodate":
			txt_title = "One-click Up-to-Date";
			txt_content = "By default en gives you a chance to review your\
			change after clicking the Up\u2011to\u2011Date button. Turn this on to\
			instead always update and sort series in one click instead of two\
			or three.";
			break;
		case "release_update":
			txt_title = "Track new releases";
			txt_content = "Check series for new releases, show series with new releases in\
							a different color on your lists and keep a count of unread releases\
							next to en's browser icon. Turn off to use en purely as a manual progress\
							tracker";
			break;
		case "notifications":
			txt_title = "Get notifications";
			txt_content = "Receive browser notifications whenever en detects a new release.";
			break;
		case "list_sync":
			txt_title = "Sync lists with mangaupdates.com";
			txt_content = "en tracks changes made to your mangaupdates.com \
								lists automatically as you browse. Turn this\
								on to also check periodically for changes you\
								may have made from other browsers or computers.";
			break;
	}
	desc_title.textContent = txt_title;
	desc_content.textContent = txt_content;
	desc_block.appendChild(desc_title);
	desc_block.appendChild(desc_content);
	return desc_block;
}

function buildOptionBlock(pref_desc) {
	var opt_block = document.createElement('div');
	opt_block.className = "optionBlock";

	switch (pref_desc) {
		case "scrollbar":
			addScrollOptions(opt_block);
			break;
		case "animations":
			addAnimationsOptions(opt_block);
			break;
		case "one_click_uptodate":
			addOneClickUpToDateOptions(opt_block);
			break;
		case "release_update":
			addReleaseUpdateOptions(opt_block);
			break;
		case "list_sync":
			addSyncOptions(opt_block);
			break;
		case "notifications":
			addNotificationsOptions(opt_block);
			break;
	}

	return opt_block;
}

function addScrollOptions(opt_block){
	var scroll_select = document.createElement('div');
	scroll_select.className = "optionSelectButton";
	scroll_select.onclick = handleToggleScrollbar;
	scroll_select.setAttribute("toggle", global_pref_scrollbar.enabled ? "on" : "off");
	opt_block.appendChild(scroll_select);
}

function addAnimationsOptions(opt_block) {
	var anim_select = document.createElement('div');
	anim_select.className = "optionSelectButton";
	anim_select.onclick = handleToggleAnimations;
	anim_select.setAttribute("toggle", global_pref_animations.enabled ? "on" : "off");
	opt_block.appendChild(anim_select);
}

function addOneClickUpToDateOptions(opt_block) {
	var oneclick_select = document.createElement('div');
	oneclick_select.className = "optionSelectButton";
	oneclick_select.onclick = handleToggleOneClick;
	oneclick_select.setAttribute("toggle", global_pref_one_click_uptodate.enabled ? "on" : "off");
	opt_block.appendChild(oneclick_select);
}

function addReleaseUpdateOptions(opt_block) {
	var release_update_select = document.createElement('div');
	var release_update_disp = document.createElement('div');
	var release_edit_text = document.createElement('span');
	var txt1 = document.createElement('span');
	var txt2 = document.createElement('span');
	release_update_select.className = "optionSelectButton";
	release_update_disp.className = "optionDisplay";
	release_edit_text.className = "optionEditText";
	release_update_select.setAttribute("toggle", global_pref_release_update.enabled ? "on" : "off");
	txt1.textContent = "Syncs every ";
	release_edit_text.textContent = (global_pref_release_update.interval).toString();
	txt2.textContent = " minutes.";
	release_update_select.onclick = handleToggleReleaseUpdates;
	release_edit_text.onclick = handleEnableReleaseUpdateIntervalEdit;
	release_update_disp.appendChild(txt1);
	release_update_disp.appendChild(release_edit_text);
	release_update_disp.appendChild(txt2);
	opt_block.appendChild(release_update_select);
	opt_block.appendChild(release_update_disp);
}

function addSyncOptions(opt_block) {
	var sync_select = document.createElement('div');
	var sync_disp = document.createElement('div');
	var sync_edit_text = document.createElement('span');
	var txt1 = document.createElement('span');
	var txt2 = document.createElement('span');
	sync_select.className = "optionSelectButton";
	sync_disp.className = "optionDisplay";
	sync_edit_text.className = "optionEditText";
	sync_select.setAttribute("toggle", global_pref_list_sync.enabled ? "on" : "off");
	txt1.textContent = "Syncs every ";
	sync_edit_text.textContent = (global_pref_list_sync.interval).toString();
	txt2.textContent = " minutes.";
	sync_select.onclick = handleToggleSync;
	sync_edit_text.onclick = handleEnableSyncIntervalEdit;
	sync_disp.appendChild(txt1);
	sync_disp.appendChild(sync_edit_text);
	sync_disp.appendChild(txt2);
	opt_block.appendChild(sync_select);
	opt_block.appendChild(sync_disp);
}

function addNotificationsOptions(opt_block) {
	var notif_select = document.createElement('div');
	notif_select.className = "optionSelectButton";
	notif_select.onclick = handleToggleNotifications;
	notif_select.setAttribute("toggle", global_pref_notifications.enabled ? "on" : "off");
	opt_block.appendChild(notif_select);
}