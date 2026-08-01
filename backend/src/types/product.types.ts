export interface Product {
    id: string;
    name: string;
    brand?: string;
    price: number;
    image?: string;
    url?: string;
    rating?: number;
    availability?: boolean;
    description?: string;
}

export interface ProductSearchResult extends Product {
    /**
     * Additional metadata specific to search results.
     */
    matchConfidence?: number;
}
