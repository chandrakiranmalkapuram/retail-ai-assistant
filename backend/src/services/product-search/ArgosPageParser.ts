import * as cheerio from 'cheerio';
import { ProductSearchResult } from '../../../../shared/types/product.types';

export class ArgosPageParser {
    /**
     * Parses the official Argos HTML to extract structured product details.
     * Attempts to read from schema.org JSON-LD first, falling back to DOM selectors.
     */
    public parse(html: string, url: string): ProductSearchResult | null {
        const $ = cheerio.load(html);
        let product: Partial<ProductSearchResult> = { url };

        // 1. Try extracting from schema.org JSON-LD (most reliable)
        const ldJsonScripts = $('script[type="application/ld+json"]');
        ldJsonScripts.each((_, el) => {
            try {
                const text = $(el).html();
                if (text) {
                    const data = JSON.parse(text);
                    // Argos might have it as an array or object
                    const schemas = Array.isArray(data) ? data : [data];
                    const productSchema = schemas.find((s: any) => s['@type'] === 'Product' || s['@type']?.includes('Product'));
                    
                    if (productSchema) {
                        if (productSchema.name) product.name = productSchema.name;
                        if (productSchema.sku) product.id = productSchema.sku;
                        if (productSchema.brand && productSchema.brand.name) product.brand = productSchema.brand.name;
                        if (productSchema.description) product.description = productSchema.description;
                        if (productSchema.image) {
                            product.image = Array.isArray(productSchema.image) ? productSchema.image[0] : productSchema.image;
                        }
                        
                        if (productSchema.offers) {
                            const offers = Array.isArray(productSchema.offers) ? productSchema.offers[0] : productSchema.offers;
                            if (offers.price) product.price = parseFloat(offers.price);
                            if (offers.availability) {
                                product.availability = offers.availability.includes('InStock') ? true : false;
                            }
                        }

                        if (productSchema.aggregateRating && productSchema.aggregateRating.ratingValue) {
                            product.rating = parseFloat(productSchema.aggregateRating.ratingValue);
                        }
                    }
                }
            } catch (e) {
                // Ignore JSON parse errors and fallback to DOM
            }
        });

        // 2. Fallback to DOM selectors for any missing fields
        if (!product.name) {
            product.name = $('h1[data-test="product-title"], h1[itemprop="name"], h1').first().text().trim();
        }
        
        if (!product.price) {
            const priceText = $('li[itemprop="price"], [data-test="product-price-primary"], .price').first().text().trim();
            const match = priceText.match(/[\d,.]+/);
            if (match) {
                product.price = parseFloat(match[0].replace(/,/g, ''));
            }
        }

        if (!product.image) {
            product.image = $('img[data-test="component-image"], img[itemprop="image"]').first().attr('src') || null;
            if (product.image && product.image.startsWith('//')) {
                product.image = 'https:' + product.image;
            }
        }

        if (!product.description) {
            product.description = $('[data-test="product-description-text"], [itemprop="description"], .product-description').text().trim().substring(0, 500);
        }

        if (!product.id) {
            // Extract from URL (e.g., argos.co.uk/product/1234567)
            const match = url.match(/\/product\/(\d+)/);
            if (match) {
                product.id = match[1];
            } else {
                product.id = `ARG-${Math.random().toString(36).substr(2, 9)}`;
            }
        }

        // Set default availability if not found
        if (product.availability === undefined) {
            product.availability = true; // Assume true if page exists
        }

        // Only return if we at least got a name and price
        if (product.name && product.price !== undefined && product.price !== null) {
            return product as ProductSearchResult;
        }

        return null;
    }
}
