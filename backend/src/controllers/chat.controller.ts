import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/llm/gemini.service';
import { ChatRequest, ChatResponse } from '../types';

export const handleChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message } = req.body as ChatRequest;
        
        if (!message) {
            res.status(400).json({ reply: 'I encountered an error: Message is required in the request body.' });
            return;
        }

        const replyText = await GeminiService.generateChatResponse(message);
        
        const response: ChatResponse = { reply: replyText };
        res.json(response);
    } catch (error) {
        next(error);
    }
};
