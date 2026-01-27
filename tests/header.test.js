const puppeteer = require('puppeteer');

jest.setTimeout(30000);

describe('header test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('should load localhost:3000', async () => {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('#root', { timeout: 10000 });

    // 👀 wait 1 second to visually inspect
    await new Promise(resolve => setTimeout(resolve, 1000));
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    // console.log(text)
    expect(text).toEqual('Blogster')
  });
  
  test.only('when signed in, shows logout button', async () => {
    const id = '6978d209559356283ff25ea2';
    const Buffer = require('safe-buffer').Buffer;

    const sessionObject = {
      passport: {
        user: id
      }
    };

    const sessionString = Buffer.from(
      JSON.stringify(sessionObject)
    ).toString('base64');

    const Keygrip = require('keygrip');
    const keys = require('../config/dev');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    await page.setCookie(
      { name: 'session', value: sessionString, url: 'http://localhost:3000' },
      { name: 'session.sig', value: sig, url: 'http://localhost:3000' }
    );
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle0'
    });

    await page.waitForSelector('a[href="/auth/logout"]');

    const text = await page.$eval(
      'a[href="/auth/logout"]',
      el => el.textContent.trim()
    );

    expect(text).toEqual('Logout');
  });
});