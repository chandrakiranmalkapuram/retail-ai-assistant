import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is missing from environment variables.');
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Retail AI Assistant",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    }
});

import { PromptBuilderService } from './prompt-builder.service';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ProductCompatibilityToolDefinition, executeProductCompatibilityTool } from '../tools/ProductCompatibilityTool';

export class GeminiService {
    private static conversationHistory: ChatCompletionMessageParam[] = [];
    private static readonly MAX_HISTORY = 20;

    static async generateChatResponse(message: string): Promise<string> {
        try {
            let messagesPayload = PromptBuilderService.buildChatPrompt(this.conversationHistory, message);

            const completion = await openai.chat.completions.create({
                model: 'google/gemini-2.5-flash',
                messages: messagesPayload,
                max_tokens: 1000,
                tools: [ProductCompatibilityToolDefinition],
                tool_choice: 'auto'
            });

            const responseMessage = completion.choices[0]?.message;
            if (!responseMessage) {
                return "I'm sorry, I couldn't generate a response.";
            }

            // 1. User message always gets added to history
            this.conversationHistory.push({ role: 'user', content: message });

            // 2. Did the AI decide to use a tool?
            if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                // Add the AI's tool call message to history
                this.conversationHistory.push(responseMessage);

                // Execute the tool locally
                for (const toolCall of responseMessage.tool_calls) {
                    if (toolCall.function.name === 'get_compatible_products') {
                        const toolResult = executeProductCompatibilityTool(toolCall.function.arguments);
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

                const secondCompletion = await openai.chat.completions.create({
                    model: 'google/gemini-2.5-flash',
                    messages: secondTurnPayload,
                    max_tokens: 1000,
                });

                const finalReply = secondCompletion.choices[0]?.message?.content || "Sorry, I couldn't summarize the findings.";
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
            console.error("OpenRouter API Error:", error);
            throw new Error("Failed to communicate with OpenRouter API");
        }
    }

    private static enforceLimit() {
        if (this.conversationHistory.length > this.MAX_HISTORY) {
            this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY);
        }
    }
}
