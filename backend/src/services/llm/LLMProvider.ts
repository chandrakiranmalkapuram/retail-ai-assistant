import { ChatCompletionMessageParam, ChatCompletionMessage } from 'openai/resources/chat/completions';

export interface LLMProvider {
    generateResponse(messages: ChatCompletionMessageParam[], tools?: any[]): Promise<ChatCompletionMessage>;
    generateToolCall(prompt: string): Promise<string>;
}
