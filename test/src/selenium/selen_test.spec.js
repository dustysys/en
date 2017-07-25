

var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
chrome = require('selenium-webdriver/chrome');
 
test.describe('Google Search', function() {
  this.timeout(30000);
  test.it('should work', function() {
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
    searchBox.sendKeys('simple programmer');
    searchBox.getAttribute('value').then(function(value) {
      assert.equal(value, 'simple programmer');
    });
    driver.quit();
  });
});