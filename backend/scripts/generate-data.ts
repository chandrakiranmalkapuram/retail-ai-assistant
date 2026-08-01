import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '../src/data');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// Helper functions
// -------------------------------------------------------------
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(prefix: string, index: number): string {
    return `${prefix}${String(index).padStart(4, '0')}`;
}

// -------------------------------------------------------------
// 1. Generate Stores (20)
// -------------------------------------------------------------
const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Liverpool', 'Edinburgh', 'Bristol', 'Cardiff'];
const stores: any[] = [];

for (let i = 1; i <= 20; i++) {
    const city = getRandomItem(cities);
    stores.push({
        storeId: generateId('STR', i),
        name: `TechRetail ${city} ${i}`,
        postcode: `${city.substring(0, 2).toUpperCase()}${getRandomInt(1, 99)} ${getRandomInt(1, 9)}XX`,
        city: city,
        latitude: 50 + Math.random() * 8, // UK approx latitudes
        longitude: -5 + Math.random() * 6  // UK approx longitudes
    });
}

// -------------------------------------------------------------
// 2. Generate Products (100)
// -------------------------------------------------------------
const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Canon', 'Epson', 'Brother'];
const categories = ['Laptops', 'Smartphones', 'TVs', 'Printers', 'Audio', 'Accessories', 'Monitors'];
const adjectives = ['Pro', 'Ultra', 'Max', 'Lite', 'Plus', 'Elite', 'Essential'];
const products: any[] = [];

for (let i = 1; i <= 100; i++) {
    const brand = getRandomItem(brands);
    const category = getRandomItem(categories);
    const adj = getRandomItem(adjectives);
    
    // Generate stock mapping for all 20 stores
    const stockByStore: Record<string, number> = {};
    for (const store of stores) {
        stockByStore[store.storeId] = getRandomInt(0, 50); // Random stock between 0 and 50
    }

    products.push({
        id: generateId('PRD', i),
        name: `${brand} ${category.substring(0, category.length - 1)} ${adj} ${getRandomInt(1000, 9999)}`,
        brand: brand,
        category: category,
        price: parseFloat((Math.random() * 1500 + 19.99).toFixed(2)),
        description: `Experience the best of ${category.toLowerCase()} with the ${brand} ${adj} series. Unmatched performance and reliability.`,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
        stockByStore: stockByStore
    });
}

// -------------------------------------------------------------
// 3. Generate Customers (50)
// -------------------------------------------------------------
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const customers: any[] = [];

for (let i = 1; i <= 50; i++) {
    const fName = getRandomItem(firstNames);
    const lName = getRandomItem(lastNames);
    customers.push({
        id: generateId('CUS', i),
        name: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`,
        phone: `+44 7700 900${String(getRandomInt(0, 999)).padStart(3, '0')}`
    });
}

// -------------------------------------------------------------
// 4. Generate Orders (200)
// -------------------------------------------------------------
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentMethods = ['Credit Card', 'PayPal', 'Debit Card', 'Apple Pay'];
const orders: any[] = [];

// Date range (last 30 days)
const now = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(now.getDate() - 30);

for (let i = 1; i <= 200; i++) {
    // Randomly pick 1 to 3 products
    const orderProducts = [];
    const numProducts = getRandomInt(1, 3);
    for (let j = 0; j < numProducts; j++) {
        orderProducts.push({
            productId: getRandomItem(products).id,
            quantity: getRandomInt(1, 2)
        });
    }

    const orderDate = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + getRandomInt(1, 7));

    const status = getRandomItem(statuses);

    orders.push({
        orderId: generateId('ORD', i),
        customerId: getRandomItem(customers).id,
        products: orderProducts,
        status: status,
        orderDate: orderDate.toISOString(),
        deliveryDate: (status === 'Delivered' || status === 'Shipped') ? deliveryDate.toISOString() : null,
        paymentMethod: getRandomItem(paymentMethods)
    });
}

// -------------------------------------------------------------
// 5. Generate Compatibility
// -------------------------------------------------------------
const compatibility = {
    "HP DeskJet 2720": ["HP 305 Black Ink", "HP 305 Tri-colour Ink"],
    "Canon PIXMA TS3350": ["Canon PG-545", "Canon CL-546"],
    "Epson Expression Home XP-4100": ["Epson 603 Black", "Epson 603 Cyan", "Epson 603 Magenta", "Epson 603 Yellow"],
    "Brother HL-L2350DW": ["Brother TN-2410", "Brother TN-2420 High Yield"],
    "Samsung Galaxy S23": ["Samsung Galaxy S23 Clear Case", "25W USB-C Fast Charger"],
    "Apple iPhone 15 Pro": ["MagSafe Clear Case", "AirPods Pro (2nd Gen)", "20W USB-C Power Adapter"]
};

// -------------------------------------------------------------
// Write Files
// -------------------------------------------------------------
fs.writeFileSync(path.join(DATA_DIR, 'stores.json'), JSON.stringify(stores, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'customers.json'), JSON.stringify(customers, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'orders.json'), JSON.stringify(orders, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'compatibility.json'), JSON.stringify(compatibility, null, 2));

console.log(`Successfully generated all mock data in ${DATA_DIR}`);
