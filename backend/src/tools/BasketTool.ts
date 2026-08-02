import { Tool } from './Tool';
import { BasketService } from '../services/basket/BasketService';

export class BasketTool implements Tool {
    name = 'basket';
    description = 'Use this tool to manage the user\'s shopping basket (cart). You can add items, remove items, view the basket, clear it, or checkout.';
    public parameters = {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['add', 'remove', 'updateQuantity', 'view', 'clear', 'checkout'],
                description: 'The action to perform on the basket.'
            },
            productId: {
                type: 'string',
                description: 'The ID of the product to add/remove/update.'
            },
            quantity: {
                type: 'number',
                description: 'The new quantity for the product (only for updateQuantity).'
            }
        },
        required: ['action']
    };

    async execute(args: Record<string, any>): Promise<any> {
        const { action, productId, quantity } = args;

        try {
            let summary = '';
            switch (action) {
                case 'add':
                    if (!productId) { summary = "Error: Please specify a productId to add."; break; }
                    const addedBasket = BasketService.addItem(productId);
                    summary = `Added item to basket. The basket now has ${addedBasket.totalQuantity} items totaling £${addedBasket.totalPrice.toFixed(2)}.`;
                    break;
                case 'remove':
                    if (!productId) { summary = "Error: Please specify a productId to remove."; break; }
                    const removedBasket = BasketService.removeItem(productId);
                    summary = `Removed item from basket. The basket now has ${removedBasket.totalQuantity} items totaling £${removedBasket.totalPrice.toFixed(2)}.`;
                    break;
                case 'updateQuantity':
                    if (!productId || typeof quantity !== 'number') { summary = "Error: Please specify a productId and a valid quantity."; break; }
                    const updatedBasket = BasketService.updateQuantity(productId, quantity);
                    summary = `Updated item quantity. The basket now has ${updatedBasket.totalQuantity} items totaling £${updatedBasket.totalPrice.toFixed(2)}.`;
                    break;
                case 'view':
                    const currentBasket = BasketService.getBasket();
                    if (currentBasket.items.length === 0) {
                        summary = "The basket is empty.";
                    } else {
                        const itemsList = currentBasket.items.map(item => 
                            `- ${item.quantity}x ${item.product.name} (£${item.price.toFixed(2)} each)`
                        ).join('\n');
                        summary = `Current basket:\n${itemsList}\n\nTotal: £${currentBasket.totalPrice.toFixed(2)}`;
                    }
                    break;
                case 'clear':
                    BasketService.clearBasket();
                    summary = "The basket has been cleared.";
                    break;
                case 'checkout':
                    const checkoutBasket = BasketService.getBasket();
                    if (checkoutBasket.items.length === 0) {
                        summary = "Cannot checkout. The basket is empty.";
                    } else {
                        summary = `ORDER SUMMARY:\n` +
                            checkoutBasket.items.map(i => `- ${i.quantity}x ${i.product.name} (£${i.subtotal.toFixed(2)})`).join('\n') +
                            `\n\nTotal Amount: £${checkoutBasket.totalPrice.toFixed(2)}\nEstimated Delivery: 2-3 business days.`;
                        BasketService.clearBasket();
                    }
                    break;
                default:
                    summary = `Error: Unknown basket action '${action}'. Valid actions: add, remove, updateQuantity, view, clear, checkout.`;
            }
            return { type: 'basket_update', summary };
        } catch (error: any) {
            return { type: 'basket_update', summary: `Error managing basket: ${error.message}` };
        }
    }
}
