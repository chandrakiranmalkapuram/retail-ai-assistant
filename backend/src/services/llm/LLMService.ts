import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { LLMProvider } from './LLMProvider';
import { OpenRouterProvider } from './OpenRouterProvider';
import { GrokProvider } from './GrokProvider';
import { PromptBuilderService } from './prompt-builder.service';
import { ProductCompatibilityToolDefinition, executeProductCompatibilityTool } from '../tools/ProductCompatibilityTool';

export class LLMService {
    private static conversationHistory: ChatCompletionMessageParam[] = [];
    private static readonly MAX_HISTORY = 20;
    private static provider: LLMProvider;

    private static getProvider(): LLMProvider {
        if (!this.provider) {
            const providerName = process.env.LLM_PROVIDER?.toLowerCase();
            if (providerName === 'grok') {
                this.provider = new GrokProvider();
            } else {
                this.provider = new OpenRouterProvider();
            }
        }
        return this.provider;
    }

    static getHistory(): ChatCompletionMessageParam[] {
        return this.conversationHistory;
    }

    static async generateChatResponse(message: string, injectedContext?: string): Promise<string> {
        try {
            let messagesPayload = PromptBuilderService.buildChatPrompt(this.conversationHistory, message);

            if (injectedContext) {
                // Append the context securely as a system instruction before the generation
                messagesPayload.push({ role: 'system', content: injectedContext });
            }

            const responseMessage = await this.getProvider().generateResponse(messagesPayload, [ProductCompatibilityToolDefinition]);

            // 1. User message always gets added to history
            this.conversationHistory.push({ role: 'user', content: message });

            // 2. Did the AI decide to use a tool?
            if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                // Add the AI's tool call message to history
                this.conversationHistory.push(responseMessage);

                // Execute the tool locally
                for (const toolCall of responseMessage.tool_calls) {
                    const call = toolCall as any;
                    if (call.function.name === 'get_compatible_products') {
                        const toolResult = executeProductCompatibilityTool(call.function.arguments);
                        // Add tool result to history
                        this.conversationHistory.push({
                            role: 'tool',
                            tool_call_id: toolCall.id,
                            content: toolResult
                        });
                    }
                }

                // 3. Make a second request so the AI can interpret the tool output
                // Import the system prompt to build the second turn manually
                const { SYSTEM_PROMPT } = await import('../../config/prompt.config');
                const secondTurnPayload: ChatCompletionMessageParam[] = [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...this.conversationHistory
                ];

                const secondResponseMessage = await this.getProvider().generateResponse(secondTurnPayload);

                const finalReply = secondResponseMessage.content || "Sorry, I couldn't summarize the findings.";
                this.conversationHistory.push({ role: 'assistant', content: finalReply });
                this.enforceLimit();
                return finalReply;
            }

            // Normal response (no tools)
            const reply = responseMessage.content || "I'm sorry, I couldn't generate a response.";
            this.conversationHistory.push({ role: 'assistant', content: reply });
            this.enforceLimit();
            return reply;

        } catch (error) {
            console.error("LLM Service Error:", error);
            throw new Error("Failed to communicate with LLM API");
        }
    }

    static async generateToolCall(prompt: string): Promise<string> {
        return this.getProvider().generateToolCall(prompt);
    }

    private static enforceLimit() {
        if (this.conversationHistory.length > this.MAX_HISTORY) {
            this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY);
        }
    }
}
