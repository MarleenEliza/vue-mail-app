export type Mail = {
    id: number;
    sender: string;
    recipants: string[];
    date: string;
    subject: string;
    content: string;
    attachment?: unknown;

};