const { Builder, By } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { HtmlUnitDriver } = require("selenium-webdriver");
const fs = require("fs");

(async function example() {
  // Set up the Chrome options
  const chromeOptions = new Options();
  chromeOptions.setHeadless(true); // Run the browser in headless mode

  // Set up the HtmlUnitDriver
  const driver = await new Builder()
    .forBrowser("htmlunit")
    .setChromeOptions(chromeOptions)
    .build();

  try {
    // Navigate to the website
    await driver.get(
      "https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/"
    );

    // Find the download button and click it
    const downloadButton = await driver.findElement(By.css("#download-button"));
    await downloadButton.click();

    // Wait for the file to download
    await driver.sleep(5000);

    // Get the downloaded file's URL and save it
    const downloadedFileUrl = await driver.getCurrentUrl();
    const file = await fetch(downloadedFileUrl);
    const buffer = await file.buffer();
    const filePath = "/path/to/save/file";

    fs.writeFileSync(filePath, buffer);
  } finally {
    await driver.quit();
  }
})();
