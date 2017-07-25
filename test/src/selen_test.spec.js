

var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
chrome = require('selenium-webdriver/chrome');
 
test.describe('Google Search', function() {
  this.timeout(30000);
  test.it('should work', function() {
    var options = new chrome.Options();
    options.setChromeBinaryPath('/usr/bin/google-chrome-stable');
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    
    var driver = new webdriver.Builder().
         forBrowser('chrome').
         setChromeOptions(options).
         build();
driver.get('http://www.google.com');
    var searchBox = driver.findElement(webdriver.By.name('q'));
    console.log("Hello");
    searchBox.sendKeys('simple programmer');
    searchBox.getAttribute('innerHTML').then(function(value) {
      console.log("Hello2");
      assert.equal(value, 'simple programmer');
    });
    driver.quit();
  });
});