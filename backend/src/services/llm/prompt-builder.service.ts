import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { SYSTEM_PROMPT } from '../../config/prompt.config';

export class PromptBuilderService {
    /**
     * Builds the array of messages to send to the OpenAI API.
     * @param history The previous conversation history.
     * @param newMessage The current message from the user.
     * @returns Array of chat completion messages.
     */
    static buildChatPrompt(
        history: ChatCompletionMessageParam[],
        newMessage: string
    ): ChatCompletionMessageParam[] {
        const messages: ChatCompletionMessageParam[] = [];

        // 1. Add System Prompt
        messages.push({
            role: 'system',
            content: SYSTEM_PROMPT,
        });

        // 2. Add History
        messages.push(...history);

        // 3. Add Current Message
        messages.push({
            role: 'user',
            content: newMessage,
        });

        return messages;
    }
}
