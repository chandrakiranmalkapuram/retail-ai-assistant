const fs = require('fs');
const path = require('path');

const customers = Array.from({ length: 10 }).map((_, i) => ({
    id: `CUS-00${i + 1}`,
    name: ['Alice Smith', 'Bob Jones', 'Charlie Brown', 'Diana Prince', 'Evan Davis', 'Fiona Gallagher', 'George Michael', 'Hannah Montana', 'Ian McKellen', 'Julia Roberts'][i],
    email: `customer${i + 1}@example.com`,
    phone: `+44 7700 9001${i.toString().padStart(2, '0')}`
}));

const statuses = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
const couriers = ['Royal Mail', 'DPD', 'Evri', 'Amazon Logistics', 'Yodel'];
const paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay'];

const orders = Array.from({ length: 30 }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const hasDelivery = ['Delivered', 'Returned'].includes(status);
    let deliveryDate = null;
    if (hasDelivery) {
        deliveryDate = new Date(date.getTime() + (Math.random() * 3 + 1) * 24 * 60 * 60 * 1000);
    }
    const hasTracking = ['Shipped', 'Out for Delivery', 'Delivered', 'Returned'].includes(status);
    
    return {
        orderId: `ORD-${(i + 1).toString().padStart(3, '0')}`,
        customerId: `CUS-00${Math.floor(Math.random() * 10) + 1}`,
        products: [
            { productId: `PRD-${(Math.floor(Math.random() * 15) + 1).toString().padStart(3, '0')}`, quantity: Math.floor(Math.random() * 3) + 1, priceAtTime: parseFloat((Math.random() * 100).toFixed(2)) }
        ],
        status,
        orderDate: date.toISOString(),
        deliveryDate: deliveryDate ? deliveryDate.toISOString() : null,
        trackingNumber: hasTracking ? `TRK${Math.floor(Math.random() * 1000000000)}` : undefined,
        courier: hasTracking ? couriers[Math.floor(Math.random() * couriers.length)] : undefined,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    };
});

fs.writeFileSync(path.join(__dirname, '../src/data/customers.json'), JSON.stringify(customers, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/orders.json'), JSON.stringify(orders, null, 2));

console.log('Generated 10 customers and 30 orders successfully.');
