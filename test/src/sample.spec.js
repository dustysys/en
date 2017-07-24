

// Mocha, Chai test

describe('karma test with Chai', function() {
  it('should expose the Chai assert method', function() {
    assert.ok('everything', 'everything is ok');
  })

  it('should expose the Chai expect method', function() {
    expect('foo').to.not.equal('bar');
    debugger;
  })

  it('should expose the Chai should property', function() {
    should.exist(123);
    (1).should.not.equal(2);
  })

})



// Sinon test

describe('Testing the throttle function', function() {
  var clock

  before(function() { clock = sinon.useFakeTimers() })
  after(function() { clock.restore() })

  it('calls callback after 100ms', function() {
    const callback = sinon.spy()

    throttle(callback)()

    clock.tick(99)
    expect(callback.notCalled).to.be.true

    clock.tick(1)
    expect(callback.calledOnce).to.be.true

    expect(new Date().getTime()).to.equal(100)
  })
});