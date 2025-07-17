export type Game = {
    id: number;
    title: string;
    platform: string;
    status: "installed" | "not installed" | "in_progress" | "completed";
    sourceUrl?: string;
    userId: number;
    createdAt: string;
};