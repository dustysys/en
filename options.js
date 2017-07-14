// file for options composition and handling


function handleToggleScrollbar() {

}

function handleToggleAnimations() {

}

function handleToggleOneClick() {

}

function handleToggleReleaseUpdates() {

}

function handleToggleSync() {

}

function handleToggleNotifications() {

}

function enableEditReleaseUpdateInterval() {

}

function enableEditSyncInterval() {

}

function buildOptionTable() {
	var opt_table = document.createElement('div');
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
			txt_content = "Turn off to get rid of the animations that play when \
							you switch to Manage Series mode or mark a series up-to-date.";
			break;
		case "one_click_uptodate":
			txt_title = "One-click Up-to-Date";
			txt_content = "Update and sort series clicked Up-to-Date in one click\
							instead of two.";
			break;
		case "release_update":
			txt_title = "Track new releases";
			txt_content = "Check series for new releases and show them in a special color.\
								Turn off to use en purely as a manual progress tracker.";
			break;
		case "notifications":
			txt_title = "Get notifications";
			txt_content = "Receive browser notifications whenever en detects a new release.";
			break;
		case "list_sync":
			txt_title = "Hard sync lists with mangaupdates.com list";
			txt_content = "en tracks changes made to your mangaupdates.com \
								lists automatically as you browse and syncs \
								them to your locally stored lists. Turn this \
								setting on to also check regularly to see if \
								you've made changes to your mangaupdates.com lists\
								from other computers/browsers besides the one en is\
								currently installed. en will delete/move any \
								series on the local list that does not match.";
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
		case "sync_update":
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
	scroll_select.className = "optionSelect";
	scroll_select.onclick = handleToggleScrollbar;
	scroll_select.setAttribute("toggle", global_pref_scrollbar.enabled ? "true" : "false");
	opt_block.appendChild(scroll_select);
}

function addAnimationsOptions(opt_block) {
	var anim_select = document.createElement('div');
	anim_select.className = "optionSelect";
	anim_select.onclick = handleToggleAnimations;
	anim_select.setAttribute("toggle", global_pref_animations.enabled ? "true" : "false");
	opt_block.appendChild(anim_select);
}

function addOneClickUpToDateOptions(opt_block) {
	var oneclick_select = document.createElement('div');
	oneclick_select.className = "optionSelect";
	oneclick_select.onclick = handleToggleOneClick;
	oneclick_select.setAttribute("toggle", global_pref_one_click_uptodate.enabled ? "true" : "false");
	opt_block.appendChild(oneclick_select);
}

function addReleaseUpdateOptions(opt_block) {
	var release_update_select = document.createElement('div');
	var release_update_disp = document.createElement('div');
	var release_edit_text = document.createElement('span');
	var txt1 = document.createElement('span');
	var txt2 = document.createElement('span');
	release_update_select.className = "optionSelect";
	release_update_disp.className = "optionDisplay";
	release_update_select.setAttribute("toggle", global_pref_release_update.enabled ? "true" : "false");
	txt1.textContent = "Syncs every ";
	release_edit_text.textContent = (global_pref_release_update.interval).toString();
	txt2.textContent = " minutes.";
	release_update_select.onclick = handleToggleReleaseUpdates;
	release_edit_text.onclick = enableEditReleaseUpdateInterval;
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
	sync_select.className = "optionSelect";
	sync_disp.className = "optionDisplay";
	sync_select.setAttribute("toggle", global_pref_list_sync.enabled ? "true" : "false");
	txt1.textContent = "Syncs every ";
	sync_edit_text.textContent = (global_pref_list_sync.interval).toString();
	txt2.textContent = " minutes.";
	sync_select.onclick = handleToggleSync;
	sync_edit_text.onclick = enableEditSyncInterval;
	sync_disp.appendChild(txt1);
	sync_disp.appendChild(sync_edit_text);
	sync_disp.appendChild(txt2);
	opt_block.appendChild(sync_select);
	opt_block.appendChild(sync_disp);
}

function addNotificationsOptions(opt_block) {
	var notif_select = document.createElement('div');
	notif_select.className = "optionSelect";
	notif_select.onclick = handleToggleNotifications;
	notif_select.setAttribute("toggle", global_pref_notifications.enabled ? "true" : "false");
	opt_block.appendChild(notif_select);
}