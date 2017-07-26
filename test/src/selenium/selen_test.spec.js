test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
chrome = require('selenium-webdriver/chrome');
should = require('chai').should();
 
test.describe('Headless Chrome Selenium', function() {
  this.timeout(30000);
  test.it('can use Google', function() {
    var options = new chrome.Options();
    /* istanbul ignore if */
    if (process.env.TRAVIS) {
        options.setChromeBinaryPath('/usr/bin/google-chrome-stable');
    }
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    
    var driver = new webdriver.Builder().
         forBrowser('chrome').
         setChromeOptions(options).
         build();
driver.get('http://www.google.com');
    var searchBox = driver.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('test');
    searchBox.getAttribute('value').then(function(value) {
      (value).should.equal('test');
    });
    driver.quit();
  });
});