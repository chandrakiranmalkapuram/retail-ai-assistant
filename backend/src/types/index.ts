export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    reply: string;
    data?: any;
}
