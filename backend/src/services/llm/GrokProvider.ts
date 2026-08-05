import OpenAI from 'openai';
import { LLMProvider } from './LLMProvider';
import { ChatCompletionMessageParam, ChatCompletionMessage } from 'openai/resources/chat/completions';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is missing from environment variables.');
}

export class GrokProvider implements LLMProvider {
    private openai = new OpenAI({
        baseURL: "https://api.x.ai/v1",
        apiKey: process.env.XAI_API_KEY,
    });

    async generateResponse(messages: ChatCompletionMessageParam[], tools?: any[]): Promise<ChatCompletionMessage> {
        const completion = await this.openai.chat.completions.create({
            model: 'grok-2-latest',
            messages,
            max_tokens: 1000,
            ...(tools && tools.length > 0 ? { tools, tool_choice: 'auto' } : {})
        });

        const responseMessage = completion.choices[0]?.message;
        if (!responseMessage) {
            throw new Error("I'm sorry, I couldn't generate a response.");
        }
        return responseMessage;
    }

    async generateToolCall(prompt: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: 'grok-2-latest',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
        });
        
        return completion.choices[0]?.message?.content || '';
    }
}
