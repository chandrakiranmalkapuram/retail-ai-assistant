import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export class ArgosPageFetcher {
    /**
     * Fetches the HTML of an Argos product page.
     * Uses Puppeteer with Stealth plugin to bypass basic anti-bot protection.
     */
    public async fetchHtml(url: string): Promise<string | null> {
        let browser;
        try {
            console.log(`[ArgosPageFetcher] Fetching official HTML for: ${url}`);
            browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            
            // Block images/CSS/fonts for faster page load since we only need DOM
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            const html = await page.content();
            return html;
        } catch (error) {
            console.error(`[ArgosPageFetcher] Failed to fetch HTML for ${url}:`, error);
            return null;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}
