export interface User {
    id: number;
    username: string;
    fio: string;
    class: string;
    score: number;
    role: 'user' | 'helper' | 'admin';
    hidden_role?: 'owner' | null;
}