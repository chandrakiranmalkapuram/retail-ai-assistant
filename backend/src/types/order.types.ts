export type OrderStatus = 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';

export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtTime: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Order {
    orderId: string; // The order number
    customerId: string;
    products: OrderItem[];
    status: OrderStatus;
    orderDate: string;
    deliveryDate: string | null;
    trackingNumber?: string;
    courier?: string;
    paymentMethod: string;
}
