

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
    });
    it('Objects with properties', ()=>{
        isEmpty({prop: true}).should.be.false;
    });
});