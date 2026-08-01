import { RetailDataService } from '../RetailDataService';
import { Order } from '../../types/order.types';

export class OrderService {
    /**
     * Gets an order by its order number.
     * @param orderNumber The order number (e.g. ORD-001)
     */
    public static getOrderByNumber(orderNumber: string): Order | undefined {
        // The RetailDataService caches the JSON in memory
        // We use any casting here because the RetailDataService types are loose, 
        // but we cast it to our strict Order interface.
        const orders = (RetailDataService as any)._orders || [];
        if (orders.length === 0) {
            RetailDataService.loadData();
        }
        const loadedOrders = (RetailDataService as any)._orders as Order[];
        return loadedOrders.find(o => o.orderId === orderNumber);
    }

    /**
     * Retrieves all orders for a specific customer.
     * @param customerId The ID of the customer
     */
    public static getCustomerOrders(customerId: string): Order[] {
        const orders = RetailDataService.getOrdersByCustomer(customerId) as Order[];
        // Sort descending by date
        return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }

    /**
     * Retrieves the latest single order for a customer.
     * @param customerId The ID of the customer
     */
    public static getLatestOrder(customerId: string): Order | undefined {
        const customerOrders = this.getCustomerOrders(customerId);
        if (customerOrders.length > 0) {
            return customerOrders[0]; // Already sorted descending
        }
        return undefined;
    }

    /**
     * Tracks an order and returns its status and courier details.
     * @param orderNumber The order number to track
     */
    public static trackOrder(orderNumber: string): Partial<Order> | undefined {
        const order = this.getOrderByNumber(orderNumber);
        if (order) {
            return {
                orderId: order.orderId,
                status: order.status,
                trackingNumber: order.trackingNumber,
                courier: order.courier,
                deliveryDate: order.deliveryDate
            };
        }
        return undefined;
    }
}
