const Page = require('./helpers/page');

let page;

beforeAll(async () => {
    page = await Page.build();
});

afterAll(async () => {
    await page.close();
});

describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });
    test('When logged in, can see blog create form', async () => {
    
        const label = await page.getContentsOf('form label');
    
        expect(label).toEqual('Blog Title');
    });
    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.waitForSelector('.title input');
            await page.type('.title input', 'My Title');

            await page.waitForSelector('.content input');
            await page.type('.content input', 'My Content');

            await page.click('form button');
        });
        test('Submitting takes user to review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitForSelector('.card-title');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');

        })
    });

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('the form shows error message', async () => {
    
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');
    
            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});

describe('When user is not logged in', async () => {
    beforeAll(async () => {
        await page.logout();
    });

    test('User can not create a blog post', async () => {
        const result = await page.evaluate(() => {
            return fetch('/api/blogs', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'My Title', content: 'My Content' })
            }).then(res => res.json());
        });
        expect(result.error).toEqual('You must log in!');
    });
    test('User can not get a list blog posts', async () => {
        const result = await page.evaluate(() => {
            return fetch('/api/blogs', {
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json());
        });
        expect(result.error).toEqual('You must log in!');
    });
});