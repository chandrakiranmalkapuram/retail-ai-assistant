import { ArgosProductSearchService } from './src/services/product-search/ArgosProductSearchService';

async function test() {
    const service = new ArgosProductSearchService();
    console.log("Searching for 'iphone 15'...");
    const results = await service.searchProducts('iphone 15');
    console.log("Results:");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
}

test();
