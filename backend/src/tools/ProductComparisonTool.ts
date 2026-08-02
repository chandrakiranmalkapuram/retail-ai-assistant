import { Tool } from './Tool';
import { ProductComparisonService } from '../services/product-comparison/ProductComparisonService';
import { ProductSearchResult } from '../../../shared/types/product.types';

export class ProductComparisonTool implements Tool {
    public name = 'product_comparison';
    public description = 'Compares multiple products. Use this when the user asks to compare two or more items or asks for differences between them (e.g. "compare iPhone 16 and Pixel 9").';
    public parameters = {
        type: 'object',
        properties: {
            productNames: {
                type: 'array',
                items: {
                    type: 'string'
                },
                description: 'An array of product names to compare (e.g., ["iPhone 16", "Samsung Galaxy S25"]).'
            }
        },
        required: ['productNames']
    };

    private comparisonService: ProductComparisonService;

    constructor() {
        this.comparisonService = new ProductComparisonService();
    }

    public async execute(args: any): Promise<ProductSearchResult[]> {
        const productNames = args.productNames;
        if (!productNames || !Array.isArray(productNames) || productNames.length === 0) {
            throw new Error("Missing or invalid 'productNames' argument for product_comparison tool");
        }
        console.log(`[ProductComparisonTool] Executing comparison for:`, productNames);
        return await this.comparisonService.compareProducts(productNames);
    }
}
