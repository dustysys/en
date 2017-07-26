

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