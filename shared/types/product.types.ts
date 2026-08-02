export interface Product {
    id: string;
    name: string | null;
    brand: string | null;
    price: number | string | null;
    image: string | null;
    url: string | null;
    rating?: number | string | null;
    availability: boolean | string | null;
    description: string | null;
}

export interface ProductSearchResult extends Product {
    matchConfidence?: number;
}
