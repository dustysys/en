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
	it('should get 3 series for REF_0\'s reading list', (done) => {
		var page_stub = sinon.stub(window, 'getListPage');
		page_stub.callsFake((list_id, cb) => cb(readListPage_REF_USER_0()));
		var list = {
			list_id: "read",
			list_type: "read",
			list_name: "Reading List",
			series_list: []
		};
		scanListForNewSeries(list, (s_list) => {
			s_list.length.should.equal(3);
			page_stub.restore();
			done();
		});
	});

	it('should get 2 series for REF_0\'s unfinished list', (done) => {
		var page_stub = sinon.stub(window, 'getListPage');
		page_stub.callsFake((list_id, cb) => cb(unfinishedListPage_REF_USER_0()));
		var list = {
			list_id: "unfinished",
			list_type: "unfinished",
			list_name: "Unfinished List",
			series_list: []
		};
		scanListForNewSeries(list, (s_list) => {
			s_list.length.should.equal(2);
			page_stub.restore();
			done();
		});
	});
});

describe('setMUVolumeChapter(volume, chapter, series)', () => {
    it('should change the volume and chapter', () => {
        var series = seriesExampleBasic1();
        setMUVolumeChapter("3", "4", series);
        (series.mu_user_volume).should.equal("3");
        (series.mu_user_chapter).should.equal("4");
    });
    it('shouldn\'t validate the input', () => {
        var series = seriesExampleBasic1();
        setMUVolumeChapter("@#$%^3-2#@#", "4/\/\/\/", series);
        (series.mu_user_volume).should.equal("@#$%^3-2#@#");
        (series.mu_user_chapter).should.equal("4/\/\/\/");
    });
    it('shouldn\'t change anything else', () => {
        var series = seriesExampleBasic1();
        var unmodified_series = seriesExampleBasic1();
        setMUVolumeChapter("3", "4", series);
        Object.getOwnPropertyNames(series).forEach(prop => {
            if (prop !== "mu_user_volume" && prop !== "mu_user_chapter") {
                (series[prop]).should.deep.equal(unmodified_series[prop]);
            }
        });
    });
});

describe('scanLoggedInUserId(callback)', () => {

    it('should return my id', (done) => {
        var member_stub = sinon.stub(window, 'getMembersPage');
        member_stub.callsFake((cb) => cb(membersPageExample1()));

        scanLoggedInUserId((user_id) => {
            user_id.should.equal("499601");
            member_stub.restore();
            done();
        });
    });

    it('should return REF_USER_0\'s ID', (done) => {
        var member_stub = sinon.stub(window, 'getMembersPage');
        member_stub.callsFake((cb) => cb(membersPage_REF_USER_0()));

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
        session_stub.callsFake((cb) => cb("No User", "123456"));

        sessionIsValid(valid_session => {
            valid_session.should.be.false;
            session_stub.restore();
            done();
        });
    });

    it('or if there is no logged in user', (done) => {
        var session_stub = sinon.stub(window, 'pullUserSessionInfo');
        session_stub.callsFake((cb) => cb("123456", "No User"));

        sessionIsValid(valid_session => {
            valid_session.should.be.false;
            session_stub.restore();
            done();
        });
    });

    it('or if there is neither user', (done) => {
        var session_stub = sinon.stub(window, 'pullUserSessionInfo');
        session_stub.callsFake((cb) => cb("No User", "No User"));

        sessionIsValid(valid_session => {
            valid_session.should.be.false;
            session_stub.restore();
            done();
        });
    });

    it('or if the two are different', (done) => {
        var session_stub = sinon.stub(window, 'pullUserSessionInfo');
        session_stub.callsFake((cb) => cb("123456", "654321"));

        sessionIsValid(valid_session => {
            valid_session.should.be.false;
            session_stub.restore();
            done();
        });
    });

    it('if they both exist and are the same, only then is the session valid', (done) => {
        var session_stub = sinon.stub(window, 'pullUserSessionInfo');
        session_stub.callsFake((cb) => cb("123456", "123456"));

        sessionIsValid(valid_session => {
            valid_session.should.be.true;
            session_stub.restore();
            done();
        });
    });

});