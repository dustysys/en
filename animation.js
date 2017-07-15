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

			animateToggleManageField(toggle);
			animateToggleUpToDateSelect(toggle, onscreen_rows, callback);
			animateToggleEditLink(toggle, onscreen_rows);
		});
	} else {
		callback(toggle);
	}
}

/**
 * plays animation for series link button moving from/to its title block position
 * @param {boolean} toggle
 * @param {Element[]} onscreen_rows
 */
function animateToggleEditLink(toggle, onscreen_rows) {
	var d_y = 100;
	var y0 = toggle ? 0 : d_y;
	var y1 = toggle ? d_y : 0;
	var time_anim = 200;
	fastdom.mutate(function () {
		for (var i = 0; i < onscreen_rows.length; i++) {
			var edit_link_wrap = getSeriesRowsEditLinkWrap(onscreen_rows[i]);
			edit_link_wrap.style.display = "";
			var link_anim = edit_link_wrap.animate([
				{ transform: `translateY(${-y1}px)` },
				{ transform: `translateY(${-y0}px)` }
			], { duration: time_anim, easing: 'linear' });
		}
	});
}

/**
 * plays animation for series management elements moving from/to their navbar position
 * @param {boolean} toggle
 */
function animateToggleManageField(toggle) {
	var manage_field = document.getElementById("manageSeriesField");
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

		manage_anim.onfinish = (function () { global_block_manage_mode = false; });
	});
}

/**
 * plays animation switching between uptodate and select buttons in button block
 * @param {boolean} toggle
 * @param {Element[]} onscreen_rows
 * @param {function(boolean)} callback
 */
function animateToggleUpToDateSelect(toggle, onscreen_rows, callback) {
	var d_y = 100;
	var y0 = toggle ? 0 : d_y;
	var y1 = toggle ? d_y : 0;
	var time_anim = 200;

	fastdom.mutate(function () {
		for (var i = 0; i < onscreen_rows.length; i++) {
			var uptodate_button = getSeriesRowsUpToDateButton(onscreen_rows[i]);
			if (uptodate_button.getAttribute("up_to_date") === "false") {
				uptodate_button.style.display = "";
				var uptodate_anim = uptodate_button.animate([
					{ transform: `translateY(${y0}px)` },
					{ transform: `translateY(${y1}px)` },
				], { duration: time_anim, easing: 'linear' });
			}
			var select_button_wrap = getSeriesRowsSeriesSelectWrap(onscreen_rows[i]);
			select_button_wrap.style.display = "";
			var select_anim = select_button_wrap.animate([
				{ transform: `translateY(${-y1}px)` },
				{ transform: `translateY(${-y0}px)` }
			], { duration: time_anim, easing: 'linear' });

			// syncs toggling of all hiding elements by waiting for the last one engaged to finish
			if (i === onscreen_rows.length - 1) {
				select_anim.onfinish = (function () { callback(toggle) });
			}
		}
	});
}