export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number | string;
    image: string;
    url: string;
    rating?: number | string;
    availability: boolean | string;
    description: string;
}

export interface ProductSearchResult extends Product {
    matchConfidence?: number;
}
