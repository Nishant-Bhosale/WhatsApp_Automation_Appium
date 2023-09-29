const { remote } = require("webdriverio");

const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android",
  "appium:appPackage": "com.whatsapp",
  "appium:appActivity": "com.whatsapp.Main",
  "appium:noReset": true,
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

let driver;

// gallery attach id - com.whatsapp:id/pickfiletype_gallery_holder

async function runTest() {
  driver = await remote(wdOpts);

  try {
    // Normal Message
    // await searchUserAndSendMessage(
    //   "Anudip Gupta",
    //   "Hii, this message is sent to you using appium!"
    // );

    // Sending Image
    await searchUserAndSendImage("Anudip Gupta", "IMG_20210215_173648.jpg");
    await goBack();
  } catch (error) {
    console.log(error);
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

const selectElementById = async (id) => {
  return await driver.$(`android=new UiSelector().resourceId("${id}")`);
};

const searchUserAndSendMessage = async (userName, message) => {
  await searchAndSelectUser(userName);

  await selectAndFillInput(message);

  await clickSendButton();
};

const searchUserAndSendImage = async (userName, imageName) => {
  await searchAndSelectUser(userName);

  const attachButton = await selectElementById(
    "com.whatsapp:id/input_attach_button"
  );

  await attachButton.click();

  const attachDocumentButton = await selectElementById(
    "com.whatsapp:id/pickfiletype_document_holder"
  );

  await attachDocumentButton.click();

  const browseOtherDocsButton = await selectElementById(
    "com.whatsapp:id/browseOtherDocs"
  );

  await browseOtherDocsButton.click();

  const imagesTab = await driver.$('//*[@text="Images"]');

  await imagesTab.click();

  const searchButton = await selectElementById(
    "com.google.android.documentsui:id/option_menu_search"
  );

  await searchButton.click();

  const searchInput = await selectElementById(
    "com.google.android.documentsui:id/search_src_text"
  );

  await searchInput.click();

  await searchInput.setValue(imageName);
  await driver.hideKeyboard();

  await driver.pause(15000);

  const image = await driver.$(
    `android= new UiSelector().resourceId("android:id/title").text("${imageName}")`
  );

  await image.click();

  await clickSendButton();
};

const searchAndSelectUser = async (userName) => {
  const searchButton = await selectElementById(
    "com.whatsapp:id/menuitem_search"
  );

  await searchButton.click();

  const searchInput = await selectElementById("com.whatsapp:id/search_input");
  await searchInput.click();
  await searchInput.setValue(userName);

  await driver.hideKeyboard();

  const contact = await driver.$(
    `android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("${userName}")`
  );

  await contact.click();
};

const goBack = async () => {
  const backButton = await selectElementById("com.whatsapp:id/back");
  await backButton.click();
};

const clickSendButton = async () => {
  const sendMessageButton = await selectElementById("com.whatsapp:id/send");
  await sendMessageButton.click();
};

const selectAndFillInput = async (message) => {
  const messageInput = await selectElementById("com.whatsapp:id/entry");
  await messageInput.click();
  await messageInput.setValue(message);
};

runTest().catch(console.error);

// {
//   type: "message",
//   message: "Hii, this message is sent to you using appium!",
//   contact: "Anudip Gupta",
// },
// {
//   type: "image",
//   contact: "Anudip Gupta",
// },
// {
//   type: "image",
//   contact: "Pranav Yeole",
// },
