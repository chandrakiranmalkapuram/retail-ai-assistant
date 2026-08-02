export interface SearchSnippet {
    title: string;
    url: string;
    content: string;
    image?: string;
    score?: number;
}

export interface SearchProvider {
    /**
     * Executes a search query across the web (or a specific domain if modified by the provider).
     * @param query The search term
     */
    search(query: string): Promise<SearchSnippet[]>;
}
