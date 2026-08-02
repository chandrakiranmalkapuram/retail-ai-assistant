import { ProductSearchResult } from '../../../shared/types/product.types';
import { SearchParser } from './SearchParser';
import { SearchSnippet } from '../providers/search/SearchProvider';

export class ArgosSearchParser implements SearchParser {
    public parse(snippets: SearchSnippet[]): ProductSearchResult[] {
        const results: ProductSearchResult[] = [];

        for (const snippet of snippets) {
            // Must be an argos product URL
            if (!snippet.url || !snippet.url.includes('argos.co.uk/product/')) {
                continue;
            }

            // Extract Product ID
            const idMatch = snippet.url.match(/\/product\/(\d+)/);
            const id = idMatch ? idMatch[1] : `argos_${Math.random().toString(36).substr(2, 9)}`;

            // Name
            let name = snippet.title;
            // Clean up common suffix
            if (name.includes('| Argos')) {
                name = name.replace('| Argos', '').trim();
            }
            if (name.startsWith('Buy ')) {
                name = name.replace('Buy ', '').trim();
            }

            // Price Extraction
            let price: number | null = null;
            const priceMatch = snippet.content.match(/£([\d,\.]+)/);
            if (priceMatch) {
                price = parseFloat(priceMatch[1].replace(/,/g, ''));
            }

            // Rating Extraction
            let rating: number | null = null;
            const ratingMatch = snippet.content.match(/Rating (\d+(\.\d+)?) out of 5/i);
            if (ratingMatch) {
                rating = parseFloat(ratingMatch[1]);
            }

            let image = snippet.image || null;
            let brand = 'Argos'; // Fallback

            results.push({
                id,
                name: name || null,
                brand,
                price,
                image,
                url: snippet.url || null,
                rating,
                availability: true, // If it's on the search index, it's generally available
                description: snippet.content ? snippet.content.substring(0, 200).trim() : null,
                matchConfidence: snippet.score || undefined
            });
        }

        return results;
    }
}
