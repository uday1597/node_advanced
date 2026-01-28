const Page = require('./helpers/page');

jest.setTimeout(30000);

describe('header test', () => {
  let page;

  beforeAll(async () => {
    page = await Page.build();
  });

  afterAll(async () => {
    await page.close();
  });

  test('should load localhost:3000', async () => {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('#root', { timeout: 10000 });

    const text = await page.$eval(
      'a.brand-logo',
      el => el.innerHTML
    );

    expect(text).toEqual('Blogster');
  });

  test('when signed in, shows logout button', async () => {
    await page.login();

    const text = await page.$eval(
      'a[href="/auth/logout"]',
      el => el.textContent.trim()
    );

    expect(text).toEqual('Logout');
  });
});
