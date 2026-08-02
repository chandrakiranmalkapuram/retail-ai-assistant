import { SearchProvider, SearchSnippet } from './SearchProvider';

export class TavilySearchProvider implements SearchProvider {
    private apiKey: string;
    private baseUrl = 'https://api.tavily.com/search';

    constructor() {
        const key = process.env.TAVILY_API_KEY;
        if (!key) {
            throw new Error('Server Error: TAVILY_API_KEY is not set in the environment variables.');
        }
        this.apiKey = key;
    }

    public async search(query: string): Promise<SearchSnippet[]> {
        // Enforce the search to only look at argos.co.uk product pages
        const scopedQuery = `site:argos.co.uk/product/ ${query}`;
        
        console.log(`[TavilySearchProvider] Executing Tavily search for: "${scopedQuery}"`);

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    query: scopedQuery,
                    search_depth: 'advanced', // Retrieve deeper content for parsing
                    include_images: true,
                    max_results: 5
                })
            });

            if (!response.ok) {
                console.error(`[TavilySearchProvider] HTTP error! status: ${response.status}`);
                return [];
            }

            const data = await response.json();
            
            if (!data.results || !Array.isArray(data.results)) {
                return [];
            }

            // Map Tavily response to our generic SearchSnippet interface
            return data.results.map((result: any) => ({
                title: result.title || '',
                url: result.url || '',
                content: result.content || '',
                score: result.score,
                // Tavily sometimes returns images array
                image: (data.images && data.images.length > 0) ? data.images[0] : undefined
            }));

        } catch (error) {
            console.error('[TavilySearchProvider] Exception during search:', error);
            return [];
        }
    }
}
