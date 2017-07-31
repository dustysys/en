

describe('The digit validator should', function () {
	it('remove letters', function () {
		validateDigits("Hello1").should.equal("1");
	});
	it('remove special characters', function () {
		(2).should.equal(2);
		validateDigits("*$@#(2@#$3-+=)&&%!").should.equal("23");
	});
});

describe('isEmpty() should report empty for', () => {
	it('undefined', () => {
		isEmpty(undefined).should.be.true;
	});
	it('null', () => {
		isEmpty(null).should.be.true;
	});
	it('empty string', () => {
		isEmpty("").should.be.true;
	});
	it('empty array', () => {
		isEmpty([]).should.be.true;
	});
	it('empty Object', () => {
		isEmpty({}).should.be.true;
	});
});

describe('isEmpty() should NOT report empty for', () => {
	it('strings with characters', () => {
		isEmpty("Test!").should.be.false;
		isEmpty("0").should.be.false;
	});
	it('arrays with elements', () => {
		isEmpty([4, "dog"]).should.be.false;
		isEmpty([0]).should.be.false;
		isEmpty([""]).should.be.false;
	});
	it('numbers', () => {
		isEmpty(0).should.be.false;
		isEmpty(1).should.be.false;
		isEmpty(Infinity).should.be.false;
		isEmpty(-100).should.be.false;
	});
	it('Objects with properties', () => {
		isEmpty({ prop: true }).should.be.false;
		isEmpty({ prop: false }).should.be.false;
		isEmpty({ prop: "" }).should.be.false;
		isEmpty({ prop: undefined }).should.be.false;
	});
	it('DOM elements', () => {
		var div = document.createElement("div");
		isEmpty(div).should.be.false;
	});
});

describe('exists() should', () => {
	it('report the opposite of isEmpty()', () => {
		exists("Test!").should.not.be.false;
		exists("0").should.not.be.false;
		exists([4, "dog"]).should.not.be.false;
		exists([0]).should.not.be.false;
		exists([""]).should.not.be.false;
		exists(0).should.not.be.false;
		exists(1).should.not.be.false;
		exists(Infinity).should.not.be.false;
		exists(-100).should.not.be.false;
		exists({ prop: true }).should.not.be.false;
		exists({ prop: false }).should.not.be.false;
		exists({ prop: "" }).should.not.be.false;
		exists({ prop: undefined }).should.not.be.false;
		var div = document.createElement("div");
		exists(div).should.not.be.false;
	});
});

describe('cmp_date(a,b) should', () => {
	it('return true if date a is newer than date b ', () => {
		cmp_date("7/27/2017", "3/14/1990").should.be.true;
		cmp_date("1/1/2001", "4/14/1600", ).should.be.true;
	});
	it('return false otherwise', () => {
		cmp_date("2/2/2002", "2/3/2002").should.be.false;
		cmp_date("2/2/2002", "2/2/2002").should.be.false;
	});
});

describe('cmpAlphabetical()', () => {
	it('should return 0 if strings are the same', () => {
		cmpAlphabetical('a', 'a').should.equal(0);
		cmpAlphabetical('123TEST321', '123TEST321').should.equal(0);
	});
	it('should return -1 if the first string comes earlier in the alphabet.', () => {
		cmpAlphabetical('a', 'z').should.equal(-1);
	});
	it('should return 1 if the second string comes earlier in the alphabet.', () => {
		cmpAlphabetical('h', 'e').should.equal(1);
	});
});

describe('cmpListAlphabetical()', () => {
	it('should call cmpAlphabetical once', () => {
		var spy = sinon.spy(window, 'cmpAlphabetical');
		var list1 = readListExampleBasic1();
		var list2 = wishListExampleBasic1();
		cmpListAlphabetical(list1, list2);
		spy.should.have.been.calledOnce;
		spy.restore();
	});
});

describe('cmpSeriesAlphabetical()', () => {
	it('should call cmpAlphabetical once', () => {
		var spy = sinon.spy(window, 'cmpAlphabetical');
		var series1 = seriesExampleBasic1();
		var series2 = seriesExampleBasic2();
		cmpSeriesAlphabetical(series1, series2);
		spy.should.have.been.calledOnce;
		spy.restore();
	});
});

describe('instancesOf()', () => {
	it('should find number of times string is in string (overlap allowed)', () => {
		instancesOf('dog', 'og').should.equal(1);
		instancesOf('raccoon', 'c').should.equal(2);
		instancesOf('banana', 'na').should.equal(2);
		instancesOf('banana', 'ana').should.equal(2);
	});

	it('should return 0 if none present', () => {
		instancesOf('cat', 'dog').should.equal(0);
	});
});

describe('cmpSeriesPopupUpdateOrder()', () => {
	var spy;
	var series1;
	var series2;
	var series3;
	var series4;
	var release1;
	var release2;
	beforeEach(() => {
		series1 = seriesExampleBasic1();
		series2 = seriesExampleBasic2();
		series3 = seriesExampleBasic3();
		series4 = seriesExampleBasic4();
		release1 = releaseExampleBasic1();
		release2 = releaseExampleBasic2();
	});

	describe('should just use cmpAlphabetical if', () => {
		beforeEach(() => spy = sinon.spy(window, 'cmpAlphabetical'));
		afterEach(() => spy.restore());

		it('neither series has a latest release', () => {
			series1.latest_unread_release = {};
			series2.latest_unread_release = {};
			var cmp = cmpSeriesPopupUpdateOrder(series1, series2);
			spy.should.have.been.calledOnce;
			cmp.should.equal(cmpAlphabetical(series1.title, series2.title));
		});

		it('they both have one and neither is marked seen', () => {
			release1.marked_seen = false;
			release2.marked_seen = false;
			series1.latest_unread_release = release1;
			series2.latest_unread_release = release2;

			var cmp = cmpSeriesPopupUpdateOrder(series1, series2);
			spy.should.have.been.calledOnce;
			cmp.should.equal(cmpAlphabetical(series1.title, series2.title));
		});

		it('they both have one and both have been marked seen', () => {
			release1.marked_seen = true;
			release2.marked_seen = true;
			series1.latest_unread_release = release1;
			series2.latest_unread_release = release2;

			var cmp = cmpSeriesPopupUpdateOrder(series1, series2);
			spy.should.have.been.calledOnce;
			cmp.should.equal(cmpAlphabetical(series1.title, series2.title));
		});

		it('one has a release and the other doesn\'t, but the release is marked seen', () => {
			release1.marked_seen = true;
			series1.latest_unread_release = release1;
			series2.latest_unread_release = {};

			var cmp = cmpSeriesPopupUpdateOrder(series1, series2);
			spy.should.have.been.calledOnce;
			cmp.should.equal(cmpAlphabetical(series1.title, series2.title));

			spy.reset();
			release2.marked_seen = true;
			series3.latest_unread_release = {};
			series4.latest_unread_release = release2;
			cmp = cmpSeriesPopupUpdateOrder(series3, series4);
			spy.should.have.been.calledOnce;
			cmp.should.equal(cmpAlphabetical(series3.title, series4.title));
		});
	});

	describe('otherwise it should', () => {
		describe('return -1 if series A has an unseen latest release and', () => {
			it('series B doesn\'t have a release', () => {
				release1.marked_seen = false;
				series1.latest_unread_release = release1;
				series2.latest_unread_release = {};
				cmpSeriesPopupUpdateOrder(series1, series2).should.equal(-1);
			});
			it('series B has a release, but it\'s marked seen', () => {
				release1.marked_seen = false;
				release2.marked_seen = true;
				series1.latest_unread_release = release1;
				series2.latest_unread_release = release2;
				cmpSeriesPopupUpdateOrder(series1, series2).should.equal(-1);
			});
		});

		describe('or return 1 if series B has an unseen latest release and', () => {
			it('series A doesn\'t have a release', () => {
				release1.marked_seen = false;
				series1.latest_unread_release = {};
				series2.latest_unread_release = release1;
				cmpSeriesPopupUpdateOrder(series1, series2).should.equal(1);
			});
			it('series A has a release, but it\'s marked seen', () => {
				release1.marked_seen = false;
				release2.marked_seen = true;
				series1.latest_unread_release = release2;
				series2.latest_unread_release = release1;
				cmpSeriesPopupUpdateOrder(series1, series2).should.equal(1);
			});
		});
	});
});