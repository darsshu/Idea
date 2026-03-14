const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

/**
 * Scraper service to check ticket availability on BookMyShow
 * @param {string} url - The BookMyShow event URL
 * @returns {Promise<{available: boolean, title: string}>}
 */
const checkAvailability = async (url) => {
    let browser;
    try {
        const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
        
        const options = isVercel ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        } : {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // Adjust this path to your local Chrome installation if needed
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
        };

        browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const title = await page.title();
        const content = await page.content();
        
        const isSoldOut = content.toLowerCase().includes('sold out') || content.toLowerCase().includes('coming soon');
        const hasBookButton = content.toLowerCase().includes('book') || content.toLowerCase().includes('buy tickets');

        const available = hasBookButton && !isSoldOut;

        await browser.close();
        return { 
            available, 
            title: title.replace(' | BookMyShow', '').replace('Tickets - BookMyShow', '').trim() 
        };
    } catch (error) {
        console.error(`Scraping error for ${url}:`, error.message);
        if (browser) await browser.close();
        throw error;
    }
};

module.exports = { checkAvailability };
