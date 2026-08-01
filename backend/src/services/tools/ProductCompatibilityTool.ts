import { ProductCompatibilityService } from './ProductCompatibilityService';

export const ProductCompatibilityToolDefinition = {
    type: 'function' as const,
    function: {
        name: 'get_compatible_products',
        description: 'Searches the database for compatible accessories (like ink cartridges) for a specific product (like a printer). Use this when the user asks which ink/accessories fit their device.',
        parameters: {
            type: 'object',
            properties: {
                productName: {
                    type: 'string',
                    description: 'The exact name of the product or printer (e.g. HP DeskJet 2720)',
                },
            },
            required: ['productName'],
        },
    }
};

export const executeProductCompatibilityTool = (args: string): string => {
    try {
        const parsed = JSON.parse(args);
        return ProductCompatibilityService.getCompatibleProducts(parsed.productName);
    } catch (e) {
        return "Failed to parse tool arguments.";
    }
};
