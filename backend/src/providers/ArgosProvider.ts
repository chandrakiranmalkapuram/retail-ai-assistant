import { RetailProvider } from './RetailProvider';
import { RetailDataService } from '../services/RetailDataService';

export class ArgosProvider implements RetailProvider {
    
    async searchProducts(query: string): Promise<any[]> {
        // Architecture defined: Implement later
        throw new Error('Method not implemented.');
    }

    async getProductDetails(productId: string): Promise<any | null> {
        // Architecture defined: Implement later
        throw new Error('Method not implemented.');
    }

    async getStoreAvailability(productId: string): Promise<any[]> {
        // Architecture defined: Implement later
        throw new Error('Method not implemented.');
    }

    async recommendAccessories(productId: string): Promise<any[]> {
        // Architecture defined: Implement later
        throw new Error('Method not implemented.');
    }

    async recommendAlternatives(productId: string): Promise<any[]> {
        // Architecture defined: Implement later
        throw new Error('Method not implemented.');
    }
}
