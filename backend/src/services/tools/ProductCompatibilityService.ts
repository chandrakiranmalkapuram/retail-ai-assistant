import { RetailDataService } from '../RetailDataService';

export class ProductCompatibilityService {
    /**
     * Finds compatible accessories (like ink) for a given product.
     * @param productName The name of the printer or product.
     * @returns A list of compatible items, or a not-found message.
     */
    static getCompatibleProducts(productName: string): string {
        const db = RetailDataService.getCompatibility();
        
        // Simple case-insensitive search
        const key = Object.keys(db).find(
            (k) => k.toLowerCase() === productName.toLowerCase()
        );

        if (key) {
            const items = db[key];
            return `Compatible products for ${key}: ${items.join(', ')}`;
        }
        
        return `No compatibility information found for ${productName}.`;
    }
}
