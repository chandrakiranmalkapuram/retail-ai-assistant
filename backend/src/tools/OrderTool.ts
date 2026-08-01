import { Tool } from './Tool';
import { OrderService } from '../services/order/OrderService';

export class OrderTool implements Tool {
    public name = 'order_support';
    public description = 'Tracks an order by order number or retrieves the order history for a customer.';
    public parameters = {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['track', 'history'],
                description: 'The action to perform. Use "track" if the user provided an order number. Use "history" if they are asking about past purchases.'
            },
            identifier: {
                type: 'string',
                description: 'The order number (for "track") or customer ID (for "history").'
            }
        },
        required: ['action', 'identifier']
    };

    public async execute(args: any): Promise<any> {
        const { action, identifier } = args;
        if (!action || !identifier) throw new Error("Missing 'action' or 'identifier' for order_support tool");

        console.log(`[OrderTool] Executing action: ${action} for identifier: ${identifier}`);
        
        try {
            if (action === 'track') {
                const result = OrderService.trackOrder(identifier);
                return result ? [result] : [];
            } else if (action === 'history') {
                const results = OrderService.getCustomerOrders(identifier);
                return results;
            }
            return [];
        } catch (error) {
            console.error(`[OrderTool] Execution error for ${action}:`, error);
            return [];
        }
    }
}
