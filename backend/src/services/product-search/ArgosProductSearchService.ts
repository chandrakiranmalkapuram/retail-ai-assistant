import { ProductSearchResult } from '../../../../shared/types/product.types';
import { SearchProvider } from '../../providers/search/SearchProvider';
import { TavilySearchProvider } from '../../providers/search/TavilySearchProvider';
import { SearchParser } from '../../parsers/SearchParser';
import { ArgosSearchParser } from '../../parsers/ArgosSearchParser';

export class ArgosProductSearchService {
    private searchProvider: SearchProvider;
    private searchParser: SearchParser;

    constructor() {
        // Initialize with Tavily and Argos Parser.
        // In a true dependency injection setup, these would be passed in.
        this.searchProvider = new TavilySearchProvider();
        this.searchParser = new ArgosSearchParser();
    }

    /**
     * Searches for products using a generic SearchProvider and SearchParser.
     * 
     * @param query The natural language search term (e.g., "cheap 4k tv")
     * @returns A promise resolving to an array of product search results.
     */
    public async searchProducts(query: string): Promise<ProductSearchResult[]> {
        console.log(`[ArgosProductSearchService] Initiating retrieval-augmented search for: "${query}"`);

        try {
            // 1. Fetch raw search snippets from the Search Engine
            const rawSnippets = await this.searchProvider.search(query);
            
            if (!rawSnippets || rawSnippets.length === 0) {
                console.log(`[ArgosProductSearchService] No search results found for "${query}".`);
                return [];
            }
            
            // 2. Parse snippets into structured ProductSearchResults
            const products = this.searchParser.parse(rawSnippets);
            
            if (products.length === 0) {
                console.log(`[ArgosProductSearchService] Could not parse any valid products from search results for "${query}".`);
            } else {
                console.log(`[ArgosProductSearchService] Successfully parsed ${products.length} products.`);
            }

            return products;
        } catch (error) {
            console.error('[ArgosProductSearchService] Error during retrieval-augmented search:', error);
            return [];
        }
    }
}
