import { ArgosProductSearchService } from '../product-search/ArgosProductSearchService';
import { ProductSearchResult } from '../../../../shared/types/product.types';

export class ProductComparisonService {
    private searchService: ArgosProductSearchService;

    constructor() {
        this.searchService = new ArgosProductSearchService();
    }

    /**
     * Takes an array of product names, searches for each, and returns
     * an array containing the top result for each product found.
     * 
     * @param productNames Array of product names to compare.
     * @returns A promise resolving to an array of products to compare.
     */
    public async compareProducts(productNames: string[]): Promise<ProductSearchResult[]> {
        console.log(`[ProductComparisonService] Comparing products: ${productNames.join(', ')}`);
        
        const results: ProductSearchResult[] = [];

        for (const name of productNames) {
            try {
                // Reuse the existing search service logic
                const searchResults = await this.searchService.searchProducts(name);
                
                // If we found something, take the first/best result for this product
                if (searchResults && searchResults.length > 0) {
                    results.push(searchResults[0]);
                } else {
                    console.warn(`[ProductComparisonService] No results found for: ${name}`);
                }
            } catch (error) {
                console.error(`[ProductComparisonService] Error searching for ${name}:`, error);
            }
        }

        return results;
    }
}
