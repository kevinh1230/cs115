var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();

var random = getRandomInt(1000,9999);

driver.get('http://localhost:8080/');
driver.findElement(webdriver.By.name('signup')).click().then(function() {
    driver.sleep(2000);
});
driver.findElement(webdriver.By.name('firstName')).sendKeys('firstname'+random);
driver.findElement(webdriver.By.name('lastName')).sendKeys('lastname'+random);
driver.findElement(webdriver.By.name('email')).sendKeys('email@'+random);
driver.findElement(webdriver.By.name('username')).sendKeys('username'+random);
driver.findElement(webdriver.By.name('password')).sendKeys('password'+random);
driver.findElement(webdriver.By.name('submit')).click().then(function() {
    driver.sleep(2000);
});

driver.findElement(webdriver.By.name('username')).sendKeys('jcheun93@gmail.com');
driver.findElement(webdriver.By.name('password')).sendKeys('1234567890');
driver.findElement(webdriver.By.name('grant')).click().then(function() {
    driver.sleep(2000);
});

driver.findElement(webdriver.By.name('friends')).click().then(function() {
    driver.sleep(2000);
});
driver.findElement(webdriver.By.name('input')).sendKeys('ephraim',webdriver.Key.RETURN);
driver.findElement(webdriver.By.name('add')).click().then(function() {
    driver.sleep(2000);
});

driver.findElement(webdriver.By.name('logout')).click().then(function() {
    driver.sleep(2000);
});

driver.findElement(webdriver.By.name('login')).click().then(function(){
	driver.sleep(2000);
});
driver.findElement(webdriver.By.name('username')).sendKeys('ephraim');
driver.findElement(webdriver.By.name('password')).sendKeys('ephraim');
driver.findElement(webdriver.By.name('login')).click().then(function() {
    driver.sleep(2000);
});

driver.findElement(webdriver.By.name('friends')).click().then(function() {
    driver.sleep(2000);
});
driver.findElement(webdriver.By.name('accept')).click();




// driver.findElement(webdriver.By.name('btnG')).click();
// driver.wait(function() {
//  return driver.getTitle().then(function(title) {
//    return title === 'webdriver - Google Search';
//  });
// }, 1000);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}