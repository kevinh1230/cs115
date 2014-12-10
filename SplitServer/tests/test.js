var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();

driver.get('http://localhost:8080/');
driver.findElement(webdriver.By.name('login')).click();
driver.findElement(webdriver.By.name('username')).sendKeys('ephraim');
driver.findElement(webdriver.By.name('password')).sendKeys('ephraim');
driver.findElement(webdriver.By.name('login')).click();

// driver.findElement(webdriver.By.name('btnG')).click();
// driver.wait(function() {
//  return driver.getTitle().then(function(title) {
//    return title === 'webdriver - Google Search';
//  });
// }, 1000);

