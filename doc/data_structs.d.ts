/*#############################################################################
File: data_struct.d.js

This file outlines and specifies the data structures which are consistent
but not formalized as objects with constructor methods in the code
#############################################################################*/

interface ReqDetails {
	requestId: string;
	method: string;
	statusCode: number;
	url: string; 
}

interface Release {
	date: string;
	title: string;
	volume: string;
	chapter: string;
	groups: string;
	marked_seen: boolean;
}

interface Series {
	series_id: string;
	title: string;
	mu_user_volume: string;
	mu_user_chapter: string;
	date_added: string;
	tracked: boolean;
	unread_releases: Release[];
	latest_read_release: Release;
	latest_unread_release: Release;
	last_update_was_manual: boolean;
	no_published_releases: boolean;
	user_link: string;
	entime_updated: string;
}

interface List {
	list_id: string;
	list_name: string;
	list_type: string;
	list_description: string;
	series_list: Series[];
}

interface Data {
	lists: List[];
}
