import { ProductSearchResult } from '../../../shared/types/product.types';
import { SearchSnippet } from '../providers/search/SearchProvider';

export interface SearchParser {
    /**
     * Parses raw search snippets into structured ProductSearchResults.
     * @param snippets The raw search results from a SearchProvider
     */
    parse(snippets: SearchSnippet[]): ProductSearchResult[];
}
