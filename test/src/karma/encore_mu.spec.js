
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