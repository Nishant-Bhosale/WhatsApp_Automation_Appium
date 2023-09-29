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

// const tests = [
//   {
//     type: "message",
//     message: "Hii, this message is sent to you using appium!",
//     contact: "Anudip Gupta",
//   },
// ];

async function runTest() {
  driver = await remote(wdOpts);

  await searchUserAndSendMessage(
    "Anudip Gupta",
    "Hii, this message is sent to you using appium!"
  );

  await goBack();

  await driver.pause(1000);
  await driver.deleteSession();

  // tests.forEach(async (test) => {
  //   const { type, message, contact } = test;

  // try {
  //   if (type === "message") {
  //     await searchUserAndSendMessage(contact, message);
  //     await goBack();
  //   } else if (type === "image") {
  //     console.log("fsd");
  //   } else {
  //     console.log("Fdsf");
  //   }
  // } catch (error) {
  //   console.log("Error:", error);
  // }
  // });
}

const selectElementById = async (id) => {
  return await driver.$(`android=new UiSelector().resourceId("${id}")`);
};

const searchUserAndSendMessage = async (userName, message) => {
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

  const messageInput = await selectElementById("com.whatsapp:id/entry");
  await messageInput.click();
  await messageInput.setValue(message);

  const sendMessageButton = await selectElementById("com.whatsapp:id/send");
  await sendMessageButton.click();
};

const goBack = async () => {
  const backButton = await selectElementById("com.whatsapp:id/back");
  await backButton.click();
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
