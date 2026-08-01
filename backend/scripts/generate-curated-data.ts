import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '../src/data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// 1. Stores (5 East London Argos locations)
// -------------------------------------------------------------
const stores = [
    { storeId: 'STR-DAG', name: 'Argos Dagenham', postcode: 'RM10 8TX', city: 'Dagenham', latitude: 51.5386, longitude: 0.1482 },
    { storeId: 'STR-ILF', name: 'Argos Ilford', postcode: 'IG1 1RS', city: 'Ilford', latitude: 51.5595, longitude: 0.0760 },
    { storeId: 'STR-ROM', name: 'Argos Romford', postcode: 'RM1 1ER', city: 'Romford', latitude: 51.5794, longitude: 0.1804 },
    { storeId: 'STR-BAR', name: 'Argos Barking', postcode: 'IG11 8RU', city: 'Barking', latitude: 51.5401, longitude: 0.0811 },
    { storeId: 'STR-LAK', name: 'Argos Lakeside', postcode: 'RM20 2ZP', city: 'West Thurrock (Lakeside)', latitude: 51.4883, longitude: 0.2829 },
];

// -------------------------------------------------------------
// 2. Products (15)
// -------------------------------------------------------------
const products = [
    { id: 'PRD-001', name: 'HP DeskJet 2720', brand: 'HP', category: 'Printers', price: 44.99, description: 'All-in-one wireless printer for home use.', rating: 4.2 },
    { id: 'PRD-002', name: 'HP 305 Black Ink', brand: 'HP', category: 'Accessories', price: 12.99, description: 'Original HP Black Ink Cartridge.', rating: 4.5 },
    { id: 'PRD-003', name: 'HP 305 Tri-colour Ink', brand: 'HP', category: 'Accessories', price: 14.99, description: 'Original HP Tri-colour Ink Cartridge.', rating: 4.4 },
    { id: 'PRD-004', name: 'Canon PIXMA TS3350', brand: 'Canon', category: 'Printers', price: 39.99, description: 'Compact wireless printer.', rating: 4.0 },
    { id: 'PRD-005', name: 'Canon PG-545', brand: 'Canon', category: 'Accessories', price: 15.99, description: 'Black Ink Cartridge.', rating: 4.6 },
    { id: 'PRD-006', name: 'Canon CL-546', brand: 'Canon', category: 'Accessories', price: 18.99, description: 'Colour Ink Cartridge.', rating: 4.6 },
    { id: 'PRD-007', name: 'Samsung Galaxy S23', brand: 'Samsung', category: 'Smartphones', price: 849.00, description: 'Flagship smartphone with amazing camera.', rating: 4.8 },
    { id: 'PRD-008', name: 'Samsung Galaxy S23 Clear Case', brand: 'Samsung', category: 'Accessories', price: 19.99, description: 'Official clear protective case.', rating: 4.1 },
    { id: 'PRD-009', name: 'Apple iPhone 15 Pro', brand: 'Apple', category: 'Smartphones', price: 999.00, description: 'Titanium frame and A17 Pro chip.', rating: 4.9 },
    { id: 'PRD-010', name: 'MagSafe Clear Case', brand: 'Apple', category: 'Accessories', price: 49.00, description: 'Official MagSafe compatible case.', rating: 4.2 },
    { id: 'PRD-011', name: 'AirPods Pro (2nd Gen)', brand: 'Apple', category: 'Audio', price: 249.00, description: 'Active noise cancelling wireless earbuds.', rating: 4.8 },
    { id: 'PRD-012', name: '20W USB-C Power Adapter', brand: 'Apple', category: 'Accessories', price: 19.00, description: 'Fast charger for iPhones and iPads.', rating: 4.7 },
    { id: 'PRD-013', name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Audio', price: 329.00, description: 'Industry leading noise cancelling headphones.', rating: 4.7 },
    { id: 'PRD-014', name: 'LG C3 55" OLED TV', brand: 'LG', category: 'TVs', price: 1299.00, description: 'Stunning 4K OLED display.', rating: 4.8 },
    { id: 'PRD-015', name: 'Brother HL-L2350DW', brand: 'Brother', category: 'Printers', price: 109.99, description: 'Compact mono laser printer.', rating: 4.5 },
];

// -------------------------------------------------------------
// 3. Inventory (Stock)
// -------------------------------------------------------------
const inventory: any[] = [];
products.forEach(p => {
    stores.forEach(s => {
        inventory.push({
            productId: p.id,
            storeId: s.storeId,
            quantity: Math.floor(Math.random() * 20) // Random stock between 0 and 19
        });
    });
});

// -------------------------------------------------------------
// 4. Customers (5)
// -------------------------------------------------------------
const customers = [
    { id: 'CUS-001', name: 'Alice Smith', email: 'alice.smith@example.com', phone: '+44 7700 900101' },
    { id: 'CUS-002', name: 'Bob Jones', email: 'bob.jones@example.com', phone: '+44 7700 900102' },
    { id: 'CUS-003', name: 'Charlie Brown', email: 'charlie.brown@example.com', phone: '+44 7700 900103' },
    { id: 'CUS-004', name: 'Diana Prince', email: 'diana.prince@example.com', phone: '+44 7700 900104' },
    { id: 'CUS-005', name: 'Evan Davis', email: 'evan.davis@example.com', phone: '+44 7700 900105' },
];

// -------------------------------------------------------------
// 5. Orders (15)
// -------------------------------------------------------------
const orders: any[] = [];
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay'];

for (let i = 1; i <= 15; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const orderProducts = [];
    
    for (let j = 0; j < numProducts; j++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        orderProducts.push({
            productId: prod.id,
            quantity: Math.floor(Math.random() * 2) + 1,
            priceAtTime: prod.price
        });
    }

    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 14)); // Last 14 days
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    orders.push({
        orderId: `ORD-${String(i).padStart(3, '0')}`,
        customerId: customer.id,
        products: orderProducts,
        status: status,
        orderDate: orderDate.toISOString(),
        deliveryDate: (status === 'Delivered' || status === 'Shipped') ? deliveryDate.toISOString() : null,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
}

// -------------------------------------------------------------
// 6. Compatibility
// -------------------------------------------------------------
const compatibility = {
    "HP DeskJet 2720": ["HP 305 Black Ink", "HP 305 Tri-colour Ink"],
    "Canon PIXMA TS3350": ["Canon PG-545", "Canon CL-546"],
    "Samsung Galaxy S23": ["Samsung Galaxy S23 Clear Case"],
    "Apple iPhone 15 Pro": ["MagSafe Clear Case", "AirPods Pro (2nd Gen)", "20W USB-C Power Adapter"],
    "Brother HL-L2350DW": ["Brother TN-2410", "Brother TN-2420 High Yield"]
};

// -------------------------------------------------------------
// Write Files
// -------------------------------------------------------------
fs.writeFileSync(path.join(DATA_DIR, 'stores.json'), JSON.stringify(stores, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'customers.json'), JSON.stringify(customers, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'orders.json'), JSON.stringify(orders, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'compatibility.json'), JSON.stringify(compatibility, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'inventory.json'), JSON.stringify(inventory, null, 2));

console.log(`Successfully generated curated mock data in ${DATA_DIR}`);
