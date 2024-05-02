#!/usr/bin/env node
import prompt from 'prompt-sync';
import puppeteer from 'puppeteer';

const rl = prompt();

(async () => {
  console.log('Opening a headless browser');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('Goto Robinsons Bank Digital');

  await page.goto('https://online.robinsonsbank.com.ph/login');

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  const username = rl({
    ask: 'Enter your username: ',
    echo: '*',
  });

  const password = rl({
    ask: 'Enter your password: ',
    echo: '*',
  });

  await page.type("input[formcontrolname='username']", username);
  await page.type("input[formcontrolname='password']", password);

  const loginBtn = "button[type='submit']";
  await page.waitForSelector(loginBtn);
  await page.click(loginBtn);
  console.log('Login Button Clicked');
  await page.click(loginBtn);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Enter your One-Time Password")'
  );
  console.log('OTP Field Found');
  const otp = rl({
    ask: 'Enter the OTP that was sent to your mobile no.: ',
    echo: '*',
  });
  await page.keyboard.type(otp);
  const submitBtn = "button[type='submit']";
  await page.waitForSelector(submitBtn);
  await page.click(submitBtn);
  console.log('Submit Button Clicked');
  await page.waitForSelector('#wrapper.enlarged .navbar-custom');
  console.log('You have successfully logged in');

  const balanceSelector = 'div > small + strong';

  let balance: number | null = null;

  while ((balance ?? 0) < 100) {
    if (typeof balance === 'number') {
      console.log(`Your current balance is: PHP ${balance}`);
    }
    await page.waitForSelector(balanceSelector);
    const balanceElement = await page.$(balanceSelector);
    balance = await page.evaluate(
      (el) => parseFloat(el?.innerText ?? '') ?? 0,
      balanceElement
    );
    await (() =>
      new Promise((res) => {
        const timeout = setTimeout(() => {
          res(null);
          clearTimeout(timeout);
        }, 5000);
      }))();
    console.log('Pinging your account...');
    await page.reload();
  }

  //   await page.waitForFunction('document.querySelector("")');

  console.log('Ctrl + C to terminate the script');
  //   await browser.close();

  // Type into search box
  //   await page.type(".search-box__input", "automate beyond recorder");

  //   // Wait and click on first result
  //   const searchResultSelector = ".search-box__link";
  //   await page.waitForSelector(searchResultSelector);
  //   await page.click(searchResultSelector);

  //   // Locate the full title with a unique string
  //   const textSelector = await page.waitForSelector(
  //     "text/Customize and automate"
  //   );
  //   const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  //   // Print the full title
  //   console.log('The title of this blog post is "%s".', fullTitle);

  //   await browser.close();
})();
