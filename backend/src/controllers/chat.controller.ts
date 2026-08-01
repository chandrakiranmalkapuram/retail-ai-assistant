import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/llm/gemini.service';
import { AIRouterService } from '../services/llm/ai-router.service';
import { ChatRequest, ChatResponse } from '../types';

export const handleChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message } = req.body as ChatRequest;
        
        if (!message) {
            res.status(400).json({ reply: 'I encountered an error: Message is required in the request body.' });
            return;
        }

        // 1. Route the message to catch product search intent (pass history for context)
        const history = GeminiService.getHistory();
        const routeResult = await AIRouterService.routeMessage(message, history);

        // 2. Pass original message + any injected context to LLM
        const replyText = await GeminiService.generateChatResponse(message, routeResult.injectedContext);
        
        const response: ChatResponse = { reply: replyText };
        res.json(response);
    } catch (error) {
        next(error);
    }
};
