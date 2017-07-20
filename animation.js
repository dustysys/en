/*#############################################################################
File: animation.js

Animations to be played based on user input are defined here.
#############################################################################*/

var global_animations = [];

/**
 * cancels any ongoing animations in the global animation array
 */
function interruptAllAnimations() {
	for (var i = 0; i < global_animations.length; i++) {
		global_animations[i].finish();
	}
}

/**
 * animate moving of marked read series into place and the list gap closing beneath it
 * @param {Element} series_row
 * @param {Number} start_el_index
 * @param {Number} end_el_index
 * @param {DOMRect} start_bbox
 * @param {DOMRect} end_bbox
 */
function animateSeriesUpdate(series_row, start_el_index, end_el_index, start_bbox, end_bbox) {
	// position of marked series relative to its old position
	if (global_pref_animations.enabled) {
		var marked_rel_start_pos = start_bbox.top - end_bbox.top;
		var gap = start_bbox.height;
		var time_marked_series_anim = -marked_rel_start_pos / 2; //linearize animation speed
		var time_list_anim = 200;

		animateMarkedSeries(series_row, marked_rel_start_pos, time_marked_series_anim);

		var buffer_rows = 3;
		var num_rows_to_anim = getNumRowsFitOnScreen() + buffer_rows;

		if (end_el_index - start_el_index > num_rows_to_anim) {
			end_el_index = start_el_index + num_rows_to_anim;
		}

		if (listFilterIsInUse()) {
			animateListGapClose(getVisibleSeriesRows(), start_el_index, end_el_index, gap, time_list_anim);
		} else {
			animateListGapClose(getSeriesRowsTable(series_row).querySelectorAll('.seriesRow'), start_el_index, end_el_index, gap, time_list_anim);
		}
	}
}


/**
 * plays marked read series falling down into place animation
 * @param {Element} series_row
 * @param {Number} start_el_index
 * @param {Number} end_el_index
 * @param {DOMRect} start_bbox
 * @param {DOMRect} end_bbox
 */
function animateMarkedSeries(series_row, start_pos, time_anim) {
	var row_wrap = getSeriesRowsWrap(series_row);
	var marked_series_anim = row_wrap.animate([
		{ transform: `translateY(${start_pos}px)` },
		{ transform: 'translateY(0)' }
	], { duration: time_anim, easing: 'linear' });
	global_animations.push(marked_series_anim);
}

/**
 * plays animation for list rising up to fill gap left by series row dropping
 * @param {Element[]} series_row_list
 * @param {Number} start_el_index
 * @param {Number} end_el_index
 * @param {Number} gap height
 * @param {Number} time_list_anim
 */
function animateListGapClose(series_row_list, start_el_index, end_el_index, gap, time_list_anim) {
	for (var i = start_el_index; i < end_el_index; i++) {
		var row_wrap = getSeriesRowsWrap(series_row_list[i]);
		var list_anim = row_wrap.animate([
			{ transform: `translateY(${gap}px)` },
			{ transform: 'translateY(0)' }
		], { duration: time_list_anim, easing: 'linear' });
		global_animations.push(list_anim);
	}
}

/**
 * plays the animation for switching between uptodate and series select buttons
 * @param {boolean} toggle
 */
function animateToggleManageMode(toggle, callback) {
	if (global_pref_animations.enabled) {
		fastdom.measure(function () {
			var onscreen_rows = getOnScreenSeriesRows();

			animateToggleManageField(toggle, callback);
			animateToggleUpToDateSelect(toggle, onscreen_rows);
			animateToggleEditLink(toggle, onscreen_rows);
		});
	} else {
		callback(toggle);
	}
}

/**
 * plays the animations for switching to the options menu
 * @param {boolean} toggle
 * @param {function} callback
 */
function animateToggleOptionMode(toggle, callback) {
	if (global_pref_animations.enabled) {
		animateToggleOptionPage(toggle);
		animateToggleNonOptionButtons(toggle, callback);
		animateToggleOptionsButton(toggle);
	} else {
		callback(toggle);
	}
}

/**
 * plays the color transition between option page and lists view
 * @param {boolean} toggle
 */
function animateToggleOptionPage(toggle) {
	var nav_bar = document.getElementById("navBar");
	var popup = document.getElementById("popup");

	fastdom.measure(function(){
		var cs = window.getComputedStyle(document.documentElement);
		var nav_color = cs.getPropertyValue('--block-color');
		var nav_color_new = cs.getPropertyValue('--block-color-new');
		var body_color = cs.getPropertyValue('--bg-color');
		var body_color_new = cs.getPropertyValue('--bg-color-new');

		var nav_color0 = toggle ? nav_color : nav_color_new;
		var nav_color1 = toggle ? nav_color_new : nav_color;
		var body_color0 = toggle ? body_color : body_color_new;
		var body_color1 = toggle ? body_color_new : body_color;

		animateElementColorChange(nav_bar, nav_color0, nav_color1);
		animateElementColorChange(popup, body_color0, body_color1);
	});
}

/**
 * plays the color transition for the option button
 * @param {boolean} toggle
 */
function animateToggleOptionsButton(toggle) {
	fastdom.measure(function () {
		var opt_button = document.getElementById("optionsButton");
		var nav_bar = document.getElementById("navBar");
		var cs = window.getComputedStyle(document.documentElement);
		var border_color = toggle ? cs.getPropertyValue('--button-text-color-new') : cs.getPropertyValue('--button-text-color');
		var nav_border_color = toggle ? cs.getPropertyValue('--border-color-new') : cs.getPropertyValue('--border-color');

		changeElementStyle(nav_bar, "border-color", nav_border_color, 100);
		changeElementStyle(opt_button, "border-color", border_color, 100);
		changeElementStyle(opt_button, "color", border_color, 100);
	});
}

/**
 * plays animation for hiding/revealing non-option buttons
 * @param {boolean} toggle
 * @param {function(boolean)} callback
 */
function animateToggleNonOptionButtons(toggle, callback) {	
	var other_buttons = document.querySelectorAll('#manageSeriesButton, #currentListField');
	var d_y = 100;
	var y1 = toggle ? 0 : d_y;
	var y0 = toggle ? d_y : 0;
	var time_anim = 200;

	for (var i = 0; i < other_buttons.length; i++) {
		
		other_buttons[i].style.display = "";
		var other_anim = other_buttons[i].animate([
			{ transform: `translateY(${y1}px)` },
			{ transform: `translateY(${y0}px)` }
		], { duration: time_anim, easing: 'linear' });

		if (i === other_buttons.length - 1) {
			other_anim.onfinish = (function () { callback(toggle); });
		}
	}
}

/**
 * changes an element's style property with a delay
 * @param {Element} element
 * @param {string} property
 * @param {string} value
 * @param {number} delay
 */
function changeElementStyle(element, property, value, delay) {
	setTimeout(function () {
		fastdom.mutate(function () {
			element.style[property] = value;
		});
	}, delay);
}

/**
 * animates a color transition between two colors for an element
 * @param {Element} element
 * @param {string} color_old
 * @param {string} color_new
 * @param {function} callback
 */
function animateElementColorChange(element, color_old, color_new, callback) {
	var color_anim = element.animate([
		{ background: color_old },
		{ background: color_new }
	], { duration: 300, fill:'forwards' });

	if (callback) callback();
}

/**
 * plays animation for series link button moving from/to its title block position
 * @param {boolean} toggle
 * @param {Element[]} onscreen_rows
 */
function animateToggleEditLink(toggle, onscreen_rows) {
	var d_y = 75;
	var y0 = toggle ? 0 : d_y;
	var y1 = toggle ? d_y : 0;
	var time_anim = 200;
	fastdom.mutate(function () {
		for (var i = 0; i < onscreen_rows.length; i++) {
			var edit_link_wrap = getSeriesRowsEditLinkWrap(onscreen_rows[i]);
			edit_link_wrap.style.display = "";
			var link_anim = edit_link_wrap.animate([
				{ transform: `translateY(${-y1}px)` },
				{ offset: 0.8, transform: `translateY(${-y0}px)` },
				{ transform: `translateY(${-y0}px)` }
			], { duration: time_anim, easing: 'linear' });
		}
	});
}

/**
 * plays animation for series management elements moving from/to their navbar position
 * @param {boolean} toggle
 */
function animateToggleManageField(toggle, callback) {
	var manage_field = document.getElementById("manageSeriesField");
	var options_button = document.getElementById("optionsButton");
	var d_y = 100;
	var y0 = toggle ? 0 : d_y;
	var y1 = toggle ? d_y : 0;
	var time_anim = 200;
	fastdom.mutate(function () {
		manage_field.style.display = "";
		var manage_anim = manage_field.animate([
			{ transform: `translateY(${-y1}px)` },
			{ transform: `translateY(${-y0}px)` }
		], { duration: time_anim, easing: 'linear' });

		options_button.style.display = "";
		var options_anim = options_button.animate([
			{ transform: `translateY(${y0}px)` },
			{ transform: `translateY(${y1}px)` },
		], { duration: time_anim, easing: 'linear' });
		options_anim.onfinish = (function () { callback(toggle) });
	});
}

/**
 * plays animation switching between uptodate and select buttons in button block
 * @param {boolean} toggle
 * @param {Element[]} onscreen_rows
 * @param {function(boolean)} callback
 */
function animateToggleUpToDateSelect(toggle, onscreen_rows) {
	var d_y = 100;
	var y0 = toggle ? 0 : d_y;
	var y1 = toggle ? d_y : 0;
	var time_anim = 200;
	var list_table = getCurrentListTable();

	fastdom.mutate(function () {
		if (list_table.getAttribute("list_type") === "read") {
			for (var i = 0; i < onscreen_rows.length; i++) {
				var uptodate_button = getSeriesRowsUpToDateButton(onscreen_rows[i]);
				var uptodate_status = uptodate_button.getAttribute("up_to_date");
				if (uptodate_status === "false" || uptodate_status === "unknown") {
					uptodate_button.style.display = "";
					var uptodate_anim = uptodate_button.animate([
						{ transform: `translateY(${y0}px)` },
						{ transform: `translateY(${y1}px)` },
					], { duration: time_anim, easing: 'linear' });
				}
			}
		}
		for (var i = 0; i < onscreen_rows.length; i++) {
			var select_button_wrap = getSeriesRowsSeriesSelectWrap(onscreen_rows[i]);
			select_button_wrap.style.display = "";
			var select_anim = select_button_wrap.animate([
				{ transform: `translateY(${-y1}px)` },
				{ transform: `translateY(${-y0}px)` }
			], { duration: time_anim, easing: 'linear' });
		}
	});
}