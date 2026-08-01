import * as fs from 'fs';
import * as path from 'path';

export class RetailDataService {
    private static _customers: any[] = [];
    private static _products: any[] = [];
    private static _orders: any[] = [];
    private static _stores: any[] = [];
    private static _compatibility: Record<string, string[]> = {};
    private static _inventory: any[] = [];
    private static _isLoaded = false;

    /**
     * Loads all JSON files into memory. 
     * Can be called once on server startup.
     */
    public static loadData() {
        if (this._isLoaded) return;
        
        const dataDir = path.join(__dirname, '../data');
        
        try {
            this._customers = JSON.parse(fs.readFileSync(path.join(dataDir, 'customers.json'), 'utf-8'));
            this._products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8'));
            this._orders = JSON.parse(fs.readFileSync(path.join(dataDir, 'orders.json'), 'utf-8'));
            this._stores = JSON.parse(fs.readFileSync(path.join(dataDir, 'stores.json'), 'utf-8'));
            this._compatibility = JSON.parse(fs.readFileSync(path.join(dataDir, 'compatibility.json'), 'utf-8'));
            this._inventory = JSON.parse(fs.readFileSync(path.join(dataDir, 'inventory.json'), 'utf-8'));
            this._isLoaded = true;
            console.log('Curated Retail JSON database loaded successfully.');
        } catch (error) {
            console.error('Failed to load JSON retail database', error);
        }
    }

    public static getProducts() {
        this.loadData();
        return this._products;
    }

    public static getProductById(id: string) {
        this.loadData();
        return this._products.find(p => p.id === id);
    }

    public static searchProducts(query: string) {
        this.loadData();
        const lowerQuery = query.toLowerCase();
        return this._products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.category.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }

    public static getOrdersByCustomer(customerId: string) {
        this.loadData();
        return this._orders.filter(o => o.customerId === customerId);
    }

    public static getStores() {
        this.loadData();
        return this._stores;
    }

    public static getCompatibility() {
        this.loadData();
        return this._compatibility;
    }

    public static getInventory() {
        this.loadData();
        return this._inventory;
    }

    public static getStockForProduct(productId: string) {
        this.loadData();
        return this._inventory.filter(i => i.productId === productId);
    }
}
