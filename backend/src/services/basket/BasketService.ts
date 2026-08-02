import * as fs from 'fs';
import * as path from 'path';
import { RetailDataService } from '../RetailDataService';
import { Basket, BasketItem } from '../../types/basket.types';
import { ProductSearchResult } from '../../../../shared/types/product.types';

export class BasketService {
    private static getBasketPath(): string {
        return path.join(__dirname, '../../data/basket.json');
    }

    public static getBasket(): Basket {
        const filePath = this.getBasketPath();
        if (!fs.existsSync(filePath)) {
            return { items: [], totalQuantity: 0, totalPrice: 0 };
        }
        try {
            const items: BasketItem[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return this.calculateTotals(items);
        } catch (e) {
            console.error('Error reading basket.json:', e);
            return { items: [], totalQuantity: 0, totalPrice: 0 };
        }
    }

    private static saveBasket(items: BasketItem[]): void {
        const filePath = this.getBasketPath();
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
    }

    public static calculateTotals(items: BasketItem[]): Basket {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
        return { items, totalQuantity, totalPrice };
    }

    public static addItem(productId: string): Basket {
        const product = RetailDataService.getProductById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found.`);
        }

        const basket = this.getBasket();
        const existingItem = basket.items.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.subtotal = existingItem.quantity * existingItem.price;
        } else {
            // Map the database product to our ProductSearchResult format
            const productData: ProductSearchResult = {
                id: product.id,
                name: product.name,
                brand: product.brand || 'Unknown',
                price: product.price,
                image: product.image_url || product.images?.[0] || '',
                url: product.url || `https://example.com/product/${product.id}`,
                rating: product.rating || 0,
                availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
                description: product.description
            };

            basket.items.push({
                product: productData,
                quantity: 1,
                price: product.price,
                subtotal: product.price
            });
        }

        this.saveBasket(basket.items);
        return this.getBasket();
    }

    public static removeItem(productId: string): Basket {
        const basket = this.getBasket();
        const newItems = basket.items.filter(item => item.product.id !== productId);
        this.saveBasket(newItems);
        return this.getBasket();
    }

    public static updateQuantity(productId: string, quantity: number): Basket {
        if (quantity <= 0) {
            return this.removeItem(productId);
        }

        const basket = this.getBasket();
        const existingItem = basket.items.find(item => item.product.id === productId);
        
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.subtotal = existingItem.quantity * existingItem.price;
            this.saveBasket(basket.items);
        }
        
        return this.getBasket();
    }

    public static clearBasket(): Basket {
        this.saveBasket([]);
        return this.getBasket();
    }
}
