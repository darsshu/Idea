const puppeteer = require('puppeteer');

/**
 * Scraper service to check ticket availability on BookMyShow
 * @param {string} url - The BookMyShow event URL
 * @returns {Promise<{available: boolean, title: string}>}
 */
const checkAvailability = async (url) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Emulate a real user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extract title
        const title = await page.title();

        // Check for specific keywords that indicate availability or sold out status
        // BookMyShow often uses "Sold Out" or "Coming Soon" or "Book" buttons
        const content = await page.content();
        
        // A common pattern on BMS is a button with text "Book" or "Available"
        // If "Sold Out" is present and "Book" is absent, it's likely sold out
        const isSoldOut = content.toLowerCase().includes('sold out') || content.toLowerCase().includes('coming soon');
        const hasBookButton = content.toLowerCase().includes('book') || content.toLowerCase().includes('buy tickets');

        // Note: BMS pages can be complex, so this is a simplified heuristic.
        // In a real scenario, we might need more specific CSS selectors.
        const available = hasBookButton && !isSoldOut;

        await browser.close();
        return { available, title: title.replace(' | BookMyShow', '') };
    } catch (error) {
        console.error(`Scraping error for ${url}:`, error);
        if (browser) await browser.close();
        throw error;
    }
};

module.exports = { checkAvailability };
