import { ProductSearchResult } from '../../../../shared/types/product.types';
import { SearchProvider } from '../../providers/search/SearchProvider';
import { TavilySearchProvider } from '../../providers/search/TavilySearchProvider';
import { ArgosPageFetcher } from './ArgosPageFetcher';
import { ArgosPageParser } from './ArgosPageParser';

export class ArgosProductSearchService {
    private searchProvider: SearchProvider;
    private pageFetcher: ArgosPageFetcher;
    private pageParser: ArgosPageParser;

    constructor() {
        // Initialize with Tavily for Stage 1, and Fetcher/Parser for Stage 2
        this.searchProvider = new TavilySearchProvider();
        this.pageFetcher = new ArgosPageFetcher();
        this.pageParser = new ArgosPageParser();
    }

    /**
     * Searches for products using a two-stage retrieval process.
     * Stage 1: Discover official Argos URLs using Tavily.
     * Stage 2: Fetch the official HTML and parse structured details.
     */
    public async searchProducts(query: string): Promise<ProductSearchResult[]> {
        console.log(`[ArgosProductSearchService] Stage 1: Initiating Tavily search for URLs: "${query}"`);

        try {
            // 1. Fetch raw search snippets to discover URLs
            const rawSnippets = await this.searchProvider.search(query);
            
            if (!rawSnippets || rawSnippets.length === 0) {
                console.log(`[ArgosProductSearchService] No search results found for "${query}".`);
                return [];
            }
            
            // Extract unique Argos URLs
            const urls = Array.from(new Set(
                rawSnippets
                    .map(snippet => snippet.url)
                    .filter(url => url && url.includes('argos.co.uk/product/'))
            ));

            console.log(`[ArgosProductSearchService] Discovered ${urls.length} Argos product URLs.`);

            // 2. Stage 2: Fetch and Parse Official Pages
            const products: ProductSearchResult[] = [];
            
            // Limit to 4 parallel fetches to avoid excessive scraping
            for (const url of urls.slice(0, 4)) {
                const html = await this.pageFetcher.fetchHtml(url);
                if (html) {
                    const parsedProduct = this.pageParser.parse(html, url);
                    if (parsedProduct) {
                        products.push(parsedProduct);
                    }
                }
            }
            
            console.log(`[ArgosProductSearchService] Stage 2 Complete. Successfully parsed ${products.length} official products.`);

            return products;
        } catch (error) {
            console.error('[ArgosProductSearchService] Error during two-stage retrieval search:', error);
            return [];
        }
    }
}
