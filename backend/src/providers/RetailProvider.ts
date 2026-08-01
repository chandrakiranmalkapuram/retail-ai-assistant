/**
 * Interface that every future retailer must implement to integrate with the AI Assistant.
 * This ensures that regardless of the backend (Argos, Currys, John Lewis, etc.),
 * the AI Tool Router can interact with them uniformly.
 */
export interface RetailProvider {
    /**
     * Searches for products based on a natural language query.
     * @param query The search term from the user (e.g., "cheap 4k tv")
     */
    searchProducts(query: string): Promise<any[]>;

    /**
     * Retrieves full details for a specific product.
     * @param productId The unique identifier of the product.
     */
    getProductDetails(productId: string): Promise<any | null>;

    /**
     * Retrieves stock levels across stores for a given product.
     * @param productId The unique identifier of the product.
     */
    getStoreAvailability(productId: string): Promise<any[]>;

    /**
     * Recommends accessories compatible with the given product.
     * @param productId The unique identifier of the primary product.
     */
    recommendAccessories(productId: string): Promise<any[]>;

    /**
     * Recommends alternative products if the user wants different options.
     * @param productId The unique identifier of the primary product.
     */
    recommendAlternatives(productId: string): Promise<any[]>;
}
