

describe('The digit validator should', function() {
    it('remove letters', function(){
        validateDigits("Hello1").should.equal("1");
    });
    it('remove special characters', function(){
        (2).should.equal(2);
        validateDigits("*$@#(2@#$3-+=)&&%!").should.equal("23");
    });
});

describe('isEmpty() should report empty for', ()=>{
    it('undefined', ()=>{
        isEmpty(undefined).should.be.true;
    });
    it('null', ()=>{
        isEmpty(null).should.be.true;
    });
    it('empty string', ()=>{
        isEmpty("").should.be.true;
    });
    it('empty array', ()=>{
        isEmpty([]).should.be.true;
    });
    it('empty Object', ()=>{
        isEmpty({}).should.be.true;
    });
});

describe('isEmpty() should NOT report empty for', ()=>{
    it('strings with characters', ()=>{
        isEmpty("Test!").should.be.false;
        isEmpty("0").should.be.false;
    });
    it('arrays with elements', ()=>{
        isEmpty([4, "dog"]).should.be.false;
        isEmpty([0]).should.be.false;
        isEmpty([""]).should.be.false;
    });
    it('numbers', ()=>{
        isEmpty(0).should.be.false;
        isEmpty(1).should.be.false;
        isEmpty(Infinity).should.be.false;
        isEmpty(-100).should.be.false;
    });
    it('Objects with properties', ()=>{
        isEmpty({prop: true}).should.be.false;
        isEmpty({prop: false}).should.be.false;
        isEmpty({prop: ""}).should.be.false;
        isEmpty({prop: undefined}).should.be.false;
    });
    it('DOM elements', ()=>{
        var div = document.createElement("div");
        isEmpty(div).should.be.false;
    });
});

describe('exists() should', ()=>{
    it('report the opposite of isEmpty()', ()=>{
        exists("Test!").should.not.be.false;
        exists("0").should.not.be.false;
        exists([4, "dog"]).should.not.be.false;
        exists([0]).should.not.be.false;
        exists([""]).should.not.be.false;
        exists(0).should.not.be.false;
        exists(1).should.not.be.false;
        exists(Infinity).should.not.be.false;
        exists(-100).should.not.be.false;
        exists({prop: true}).should.not.be.false;
        exists({prop: false}).should.not.be.false;
        exists({prop: ""}).should.not.be.false;
        exists({prop: undefined}).should.not.be.false;
        var div = document.createElement("div");
        exists(div).should.not.be.false;
    });
});

describe('cmp_date(a,b) should', ()=>{
    it('return true if date a is newer than date b ', ()=>{
        cmp_date("7/27/2017", "3/14/1990").should.be.true;
        cmp_date("1/1/2001", "4/14/1600", ).should.be.true;
    });
    it('return false otherwise', ()=>{
        cmp_date("2/2/2002", "2/3/2002").should.be.false;
        cmp_date("2/2/2002", "2/2/2002").should.be.false;
    });
});