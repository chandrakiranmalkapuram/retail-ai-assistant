import type { ProductSearchResult } from '../../../shared/types/product.types';

export interface BasketItem {
    product: ProductSearchResult;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Basket {
    items: BasketItem[];
    totalQuantity: number;
    totalPrice: number;
}
