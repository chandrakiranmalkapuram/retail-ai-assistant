export interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    data?: any;
    timestamp: number;
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: Message[];
    isPinned?: boolean;
}