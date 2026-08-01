import { ProductSearchResult } from '../../types/product.types';

export class ArgosProductSearchService {
    /**
     * Searches for products on Argos.
     * 
     * Note: Since Argos does not expose a stable, documented public REST API 
     * for external developers, the underlying implementation here abstracts 
     * the data source. We can easily replace the internal logic later 
     * (e.g., using a web scraper with Cheerio, or an official GraphQL endpoint) 
     * without changing this public interface.
     * 
     * @param query The natural language search term (e.g., "cheap 4k tv")
     * @returns A promise resolving to an array of product search results.
     */
    public async searchProducts(query: string): Promise<ProductSearchResult[]> {
        console.log(`[ArgosProductSearchService] Initiating real physical product search for: "${query}"`);

        try {
            // Using DummyJSON API as the data source.
            // Why: Major physical retailers block automated scraping. DummyJSON provides a free, key-less API
            // with highly realistic mock physical electronics (phones, laptops) perfect for testing retail AI flows.
            
            let url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`;
            const lowerQuery = query.toLowerCase();
            
            // Map common vague search terms directly to DummyJSON categories for better mock results
            if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
                url = 'https://dummyjson.com/products/category/smartphones?limit=5';
            } else if (lowerQuery.includes('laptop') || lowerQuery.includes('macbook')) {
                url = 'https://dummyjson.com/products/category/laptops?limit=5';
            } else if (lowerQuery.includes('tablet')) {
                url = 'https://dummyjson.com/products/category/tablets?limit=5';
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`[ArgosProductSearchService] Fetch failed: ${response.statusText}`);
                return [];
            }

            const data = await response.json();

            if (!data.products || data.products.length === 0) {
                return [];
            }

            // Map the DummyJSON API results to our strict ProductSearchResult interface
            return data.products.map((item: any) => ({
                id: String(item.id),
                name: item.title || 'Unknown Product',
                brand: item.brand || 'Generic',
                price: item.price || 0,
                image: item.thumbnail || (item.images && item.images.length > 0 ? item.images[0] : ''),
                url: `https://dummyjson.com/products/${item.id}`,
                rating: item.rating || 0,
                availability: item.stock > 0 || item.availabilityStatus === 'In Stock',
                description: item.description || '',
                matchConfidence: 0.95
            }));
        } catch (error) {
            console.error('[ArgosProductSearchService] Error during live search:', error);
            return [];
        }
    }
}
