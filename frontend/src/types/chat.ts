export interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    data?: any;
    timestamp: number;
}