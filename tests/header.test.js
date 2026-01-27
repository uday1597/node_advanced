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

// 👀 wait 3 seconds to visually inspect
    await new Promise(resolve => setTimeout(resolve, 3000));
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    // console.log(text)
    expect(text).toEqual('Blogster')
 });
});
