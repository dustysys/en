describe('The digit validator should', function() {
    it('remove letters', function(){
        validateDigits("Hello1").should.equal("1");
    });
    it('remove special characters', function(){
        (2).should.equal(2);
        validateDigits("*$@#(2@#$3-+=)&&%!").should.equal("23");
    });
});