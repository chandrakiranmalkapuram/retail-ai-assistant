export interface Tool {
    name: string;
    description: string;
    parameters: any; // A JSON Schema describing the arguments the tool expects
    execute(args: any): Promise<any>;
}
