import { Tool } from './Tool';
import { ProductSearchTool } from './ProductSearchTool';
import { OrderTool } from './OrderTool';
import { ProductComparisonTool } from './ProductComparisonTool';
import { BasketTool } from './BasketTool';

export class ToolRegistry {
    private static tools: Map<string, Tool> = new Map();

    /**
     * Registers a tool in the registry.
     */
    public static registerTool(tool: Tool) {
        this.tools.set(tool.name, tool);
        console.log(`[ToolRegistry] Registered tool: ${tool.name}`);
    }

    /**
     * Gets a tool by its name.
     */
    public static getTool(name: string): Tool | undefined {
        return this.tools.get(name);
    }

    /**
     * Returns all registered tools as an array of JSON Schemas for the LLM.
     */
    public static getToolDefinitions(): any[] {
        const definitions: any[] = [];
        this.tools.forEach(tool => {
            definitions.push({
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            });
        });
        return definitions;
    }

    /**
     * Initialize standard tools.
     */
    public static initialize() {
        this.registerTool(new ProductSearchTool());
        this.registerTool(new OrderTool());
        this.registerTool(new ProductComparisonTool());
    }
}

// Auto-initialize standard tools
ToolRegistry.initialize();
