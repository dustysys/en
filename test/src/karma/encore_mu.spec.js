describe('listPageIsPrimed(list_page)', () => {
	it('should identify list without priority and perpage limit as being primed', () => {
		var page = readListPage_REF_USER_0();
		var is_primed = listPageIsPrimed(page);
		is_primed.should.be.true;
	});
	it('should identify list with priority as not primed', () => {
		var page = wishListPage_REF_USER_0();
		var is_primed = listPageIsPrimed(page);
		is_primed.should.be.false;
	});
	// TODO: test list with different page limit
});

describe('scanListForNewSeries(existing_list, callback, iteration)', () => {
	var page_stub;

	before(() => page_stub = stubListPage("REF_USER_0"));
	after(() => page_stub.restore());

	it('should get 3 series for REF_0\'s reading list', (done) => {
		var list = getEmptyDefaultListById('read');
		scanListForNewSeries(list, s_list => {
			s_list.length.should.equal(3);
			done();
		});
	});

	it('should get 2 series for REF_0\'s unfinished list', (done) => {
		var list = getEmptyDefaultListById('unfinished');
		scanListForNewSeries(list, s_list => {
			s_list.length.should.equal(2);
			done();
		});
	});
});

describe('setMUVolumeChapter(volume, chapter, series)', () => {
	it('should change the volume and chapter', () => {
		var series = seriesExampleBasic1();
		setMUVolumeChapter("3", "4", series);
		series.mu_user_volume.should.equal("3");
		series.mu_user_chapter.should.equal("4");
	});
	it('shouldn\'t validate the input', () => {
		var series = seriesExampleBasic1();
		setMUVolumeChapter("@#$%^3-2#@#", "4/\/\/\/", series);
		series.mu_user_volume.should.equal("@#$%^3-2#@#");
		series.mu_user_chapter.should.equal("4/\/\/\/");
	});
	it('shouldn\'t change anything else', () => {
		var series = seriesExampleBasic1();
		var unmodified_series = seriesExampleBasic1();
		setMUVolumeChapter("3", "4", series);
		Object.getOwnPropertyNames(series).forEach(prop => {
			if (prop !== "mu_user_volume" && prop !== "mu_user_chapter") {
				series[prop].should.deep.equal(unmodified_series[prop]);
			}
		});
	});
});

describe('getListIdByEnum()', () => {
	it('should get the correct ID for default lists', () => {
		getListIdByEnum(ListEnum.READING).should.equal("read");
		getListIdByEnum(ListEnum.WISH).should.equal("wish");
		getListIdByEnum(ListEnum.COMPLETE).should.equal("complete");
		getListIdByEnum(ListEnum.UNFINISHED).should.equal("unfinished");
		getListIdByEnum(ListEnum.ONHOLD).should.equal("hold");
	});
	it('should get the correct ID for custom lists', () => {
		getListIdByEnum(101).should.equal("user1");
		getListIdByEnum(110).should.equal("user10");
		getListIdByEnum(200).should.equal("user100");
	});
});

describe('scanLoggedInUserId(callback)', () => {

	it('should return my id', (done) => {
		var member_stub = sinon.stub(window, 'getMembersPage');
		member_stub.callsFake(cb => cb(membersPageExample1()));

		scanLoggedInUserId((user_id) => {
			user_id.should.equal("499601");
			member_stub.restore();
			done();
		});
	});

	it('should return REF_USER_0\'s ID', (done) => {
		var member_stub = sinon.stub(window, 'getMembersPage');
		member_stub.callsFake(cb => cb(membersPage_REF_USER_0()));

		scanLoggedInUserId((user_id) => {
			user_id.should.equal("501586");
			member_stub.restore();
			done();
		});
	});
});

describe('sessionIsValid(callback)', () => {
	it('should be invalid if there is no current user', (done) => {
		var session_stub = sinon.stub(window, 'pullUserSessionInfo');
		session_stub.callsFake(cb => cb("No User", "123456"));

		sessionIsValid(valid_session => {
			valid_session.should.be.false;
			session_stub.restore();
			done();
		});
	});

	it('or if there is no logged in user', (done) => {
		var session_stub = sinon.stub(window, 'pullUserSessionInfo');
		session_stub.callsFake(cb => cb("123456", "No User"));

		sessionIsValid(valid_session => {
			valid_session.should.be.false;
			session_stub.restore();
			done();
		});
	});

	it('or if there is neither user', (done) => {
		var session_stub = sinon.stub(window, 'pullUserSessionInfo');
		session_stub.callsFake(cb => cb("No User", "No User"));

		sessionIsValid(valid_session => {
			valid_session.should.be.false;
			session_stub.restore();
			done();
		});
	});

	it('or if the two are different', (done) => {
		var session_stub = sinon.stub(window, 'pullUserSessionInfo');
		session_stub.callsFake(cb => cb("123456", "654321"));

		sessionIsValid(valid_session => {
			valid_session.should.be.false;
			session_stub.restore();
			done();
		});
	});

	it('if they both exist and are the same, only then is the session valid', (done) => {
		var session_stub = sinon.stub(window, 'pullUserSessionInfo');
		session_stub.callsFake(cb => cb("123456", "123456"));

		sessionIsValid(valid_session => {
			valid_session.should.be.true;
			session_stub.restore();
			done();
		});
	});

});

describe('pullAllData()', () => {
	var load_stub;
	var save_stub;
	var list_page_stub;
	var mylist_stub;
	var edit_list_stub;
	before(() => {
		load_stub = stubLoadDataEmpty();
		save_stub = stubSaveDataReturnOnly();
		list_page_stub = stubListPage("REF_USER_0", true);
		mylist_stub = sinon.stub(window, 'getMyListPage');
		mylist_stub.callsFake(cb => cb(myListPage_REF_USER_0()));
		edit_list_stub = sinon.stub(window, 'getEditListPage');
		edit_list_stub.callsFake(cb => cb(editListPage_REF_USER_0()));

	});

	after(() => {
		load_stub.restore();
		save_stub.restore();
		list_page_stub.restore();
		mylist_stub.restore();
	});

	it('should pull 18 series', (done) => {
		pullAllData(data => {
			getNumTotalSeries(data.lists).should.equal(18);
			done();
		});
	}).timeout(5000);
});


function stubLoadDataEmpty() {
	var load_stub = sinon.stub(window, 'loadData');
	load_stub.callsFake(cb => cb("No Data"));

	return load_stub;
}

function stubSaveDataReturnOnly() {
	var save_stub = sinon.stub(window, 'saveData');
	save_stub.callsFake((data, cb) => {
		console.log("Saved data");
		cb(data);
	});

	return save_stub;
}

function stubListPage(username, primed) {
	var list_page_stub = sinon.stub(window, 'getListPage');
	list_page_stub.callsFake((list_id, cb) => {
		cb(getListPageById(list_id, username, primed));
	});
	return list_page_stub;
}

function getEmptyDefaultListById(list_id) {
	var list_type;
	var list_name;
	switch (list_id) {
		case "read":
			list_type = "read";
			list_name = "Reading List";
			break;
		case "wish":
			list_type = "wish";
			list_name = "Wish List";
			break;
		case "complete":
			list_type = "complete";
			list_name = "Complete List";
			break;
		case "unfinished":
			list_type = "unfinished";
			list_name = "Unfinished List";
			break;
		case "hold":
			list_type = "hold";
			list_name = "On Hold List";
			break;
	}
	var list = {
		list_id: list_id,
		list_type: list_type,
		list_name: list_name,
		series_list: []
	};

	return list;
}

function getEmptyCustomListById(list_id, username) {
	var list_type;
	var list_name;
	if (username === "REF_USER_0") {
		switch (list_id) {
			case "user1":
				list_type = "read";
				list_name = "usr_read";
				break;
			case "user2":
				list_type = "wish";
				list_name = "usr_wish";
				break;
			case "user3":
				list_type = "complete";
				list_name = "usr_complete";
				break;
			case "user4":
				list_type = "unfinished";
				list_name = "usr_unfinished";
				break;
		}
	}
	var list = {
		list_id: list_id,
		list_type: list_type,
		list_name: list_name,
		series_list: []
	};

	return list;
}

function getListPageById(list_id, username, primed) {
	if (username === "REF_USER_0") {
		return getListPageById_REF_USER_0(list_id, primed);
	}
}

function getListPageById_REF_USER_0(list_id, primed) {
	switch (list_id) {
		case "read":
			return readListPage_REF_USER_0();
		case "wish":
			if (primed) return wishListPagePrimed_REF_USER_0();
			else return wishListPage_REF_USER_0();
		case "complete":
			return completeListPage_REF_USER_0();
		case "unfinished":
			return unfinishedListPage_REF_USER_0();
		case "hold":
			return holdListPage_REF_USER_0();
		case "user1":
			return customReadListPage_REF_USER_0();
		case "user2":
			return customWishListPage_REF_USER_0();
		case "user3":
			return customCompleteListPage_REF_USER_0();
		case "user4":
			return customUnfinishedListPage_REF_USER_0();
	}
}