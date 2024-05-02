#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var import_prompt_sync = __toESM(require("prompt-sync"));
var import_puppeteer = __toESM(require("puppeteer"));
var rl = (0, import_prompt_sync.default)();
(async () => {
  console.log("Opening a headless browser");
  const browser = await import_puppeteer.default.launch();
  const page = await browser.newPage();
  console.log("Goto Robinsons Bank Digital");
  await page.goto("https://online.robinsonsbank.com.ph/login");
  await page.setViewport({ width: 1080, height: 1024 });
  const username = rl({
    ask: "Enter your username: ",
    echo: "*"
  });
  const password = rl({
    ask: "Enter your password: ",
    echo: "*"
  });
  await page.type("input[formcontrolname='username']", username);
  await page.type("input[formcontrolname='password']", password);
  const loginBtn = "button[type='submit']";
  await page.waitForSelector(loginBtn);
  await page.click(loginBtn);
  console.log("Login Button Clicked");
  await page.click(loginBtn);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Enter your One-Time Password")'
  );
  console.log("OTP Field Found");
  const otp = rl({
    ask: "Enter the OTP that was sent to your mobile no.: ",
    echo: "*"
  });
  await page.keyboard.type(otp);
  const submitBtn = "button[type='submit']";
  await page.waitForSelector(submitBtn);
  await page.click(submitBtn);
  console.log("Submit Button Clicked");
  await page.waitForSelector("#wrapper.enlarged .navbar-custom");
  console.log("You have successfully logged in");
  const balanceSelector = "div > small + strong";
  let balance = null;
  while ((balance ?? 0) < 100) {
    if (typeof balance === "number") {
      console.log(`Your current balance is: PHP ${balance}`);
    }
    await page.waitForSelector(balanceSelector);
    const balanceElement = await page.$(balanceSelector);
    balance = await page.evaluate(
      (el) => parseFloat((el == null ? void 0 : el.innerText) ?? "") ?? 0,
      balanceElement
    );
    await (() => new Promise((res) => {
      const timeout = setTimeout(() => {
        res(null);
        clearTimeout(timeout);
      }, 5e3);
    }))();
    console.log("Pinging your account...");
    await page.reload();
  }
  console.log("Ctrl + C to terminate the script");
})();
