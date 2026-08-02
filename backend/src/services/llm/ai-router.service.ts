import OpenAI from 'openai';
import { ToolRegistry } from '../../tools/ToolRegistry';

export interface RouteResult {
    originalMessage: string;
    injectedContext?: string;
    toolData?: any;
}

export class AIRouterService {
    // We reuse the configured OpenAI client for tool classification
    private static openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Retail AI Assistant",
        }
    });

    /**
     * Intercepts user messages, uses LLM to select a tool from the ToolRegistry, and executes it.
     */
    public static async routeMessage(message: string, history: any[] = []): Promise<RouteResult> {
        try {
            console.log(`[AIRouterService] Analyzing intent for tool selection: "${message}"`);
            
            // Format history for context
            const historyStr = history.map(h => `${h.role}: ${typeof h.content === 'string' ? h.content : JSON.stringify(h.content)}`).join('\n');

            const tools = ToolRegistry.getToolDefinitions();
            
            // Instruct the LLM to choose a tool based on the registry
            const classificationPrompt = `
You are a smart router for a retail AI assistant. Your job is to select the most appropriate tool to handle the user's latest message based on the conversation history.

Conversation History:
${historyStr}

User's latest message: "${message}"

Available Tools:
${JSON.stringify(tools, null, 2)}

Instructions:
1. Analyze the user's message and history.
2. If the user's request is VAGUE (e.g., they ask for a product but do not specify details, or they ask to track an order but do not provide an order number), do NOT call a tool. Instead, respond with a JSON indicating no tool, so you can ask clarifying questions later.
3. If a tool is required and you have enough information, select it from the Available Tools list. Note: For order history requests, use customer ID "CUS-001".
4. You MUST respond with ONLY a valid JSON object in the following format. Do not include markdown code blocks or any other text.

JSON Format:
{
  "tool": "name_of_tool_or_none",
  "args": {
    "arg1": "value1"
  },
  "reasoning": "A brief explanation of why you chose this tool or why you chose none."
}

If no tool is appropriate or the request is vague, use:
{
  "tool": "none",
  "args": {},
  "reasoning": "The request was too vague or didn't match a tool."
}
`;

            const completion = await this.openai.chat.completions.create({
                model: 'google/gemini-2.5-flash',
                messages: [{ role: 'user', content: classificationPrompt }],
                max_tokens: 200,
            });

            const reply = completion.choices[0]?.message?.content?.trim() || '';
            
            // Clean up any potential markdown formatting the LLM might have ignored instructions and added
            const jsonStr = reply.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
            
            let parsed: any;
            try {
                parsed = JSON.parse(jsonStr);
                console.log(`[AIRouterService] Tool decision: ${parsed.tool}. Reasoning: ${parsed.reasoning}`);
            } catch (parseError) {
                console.error(`[AIRouterService] Failed to parse LLM tool selection JSON: ${reply}`);
                return { originalMessage: message };
            }

            if (parsed.tool === 'none') {
                return {
                    originalMessage: message,
                    injectedContext: `The router determined that no tools were called, likely because the user's request was vague or general. If the user is asking for a product or tracking an order but missing details (like budget/brand or an order number), explicitly ask them for those missing details. If they are just chatting, respond naturally.`
                };
            }

            // Look up the tool in the dynamic registry
            const tool = ToolRegistry.getTool(parsed.tool);
            
            if (tool) {
                console.log(`[AIRouterService] Executing dynamically loaded tool: ${tool.name}`);
                const results = await tool.execute(parsed.args);
                
                let resultsStr = JSON.stringify(results, null, 2);
                if (results && results.length === 0) {
                    resultsStr = "No results found.";
                }
                
                let formattingRule = `CRITICAL FORMATTING RULE: The system has already displayed the products to the user in a UI. You MUST NOT list the products or output any markdown bullet points. Provide a brief, friendly, conversational summary of the results.`;

                if (tool.name === 'product_comparison') {
                    formattingRule = `CRITICAL FORMATTING RULE: The system has already displayed a comparison table to the user in the UI. You MUST NOT list the products or output any markdown bullet points. 
Just explain the price differences, ratings, pros, cons, and best value in a detailed conversational analysis. 
Finish your analysis with a bold 'My recommendation:' section.`;
                } else if (tool.name === 'basket') {
                    formattingRule = `CRITICAL FORMATTING RULE: The user has updated their basket or asked to view/checkout their basket. Politely summarize the action taken. If they checked out, present the Order Summary nicely.`;
                }

                return {
                    originalMessage: message,
                    injectedContext: `The system automatically executed the tool "${tool.name}" with arguments ${JSON.stringify(parsed.args)}. Below are the results. Please summarize this politely and helpfully for the user.
${formattingRule}

TOOL RESULTS:
${resultsStr}`,
                    toolData: results
                };
            } else {
                console.error(`[AIRouterService] LLM requested unknown tool: ${parsed.tool}`);
                return { originalMessage: message };
            }
            
        } catch (error) {
            console.error('[AIRouterService] Routing error, falling back to basic flow:', error);
            return { originalMessage: message };
        }
    }
}
