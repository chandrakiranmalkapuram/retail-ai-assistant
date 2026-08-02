import { Tool } from './Tool';
import { ArgosProductSearchService } from '../services/product-search/ArgosProductSearchService';
import { ProductSearchResult } from '../../../shared/types/product.types';

export class ProductSearchTool implements Tool {
    public name = 'product_search';
    public description = 'Searches the live product database for physical items. Use this when the user is looking to find, browse, or buy a specific product.';
    public parameters = {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'The product name or keywords to search for (e.g., "iphone", "gaming laptop under 1000").'
            }
        },
        required: ['query']
    };

    private searchService: ArgosProductSearchService;

    constructor() {
        this.searchService = new ArgosProductSearchService();
    }

    public async execute(args: any): Promise<ProductSearchResult[]> {
        const query = args.query;
        if (!query) throw new Error("Missing 'query' argument for product_search tool");
        console.log(`[ProductSearchTool] Executing search for: "${query}"`);
        return await this.searchService.searchProducts(query);
    }
}
