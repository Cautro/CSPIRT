export interface IUser {
    id: number;
    username: string;
    password_hash: string;
    role: 'admin' | 'teacher' | 'helper' | 'user';
    hidden_role?: 'owner' | null;
    score: number;
}

export interface IComplaint {
    id: number;
    from_user_id: number;
    to_user_id: number;
    content: string;
    created_at: string;
}

export interface INote {
    id: number;
    user_id: number;
    author_id: number;
    content: string;
    created_at: string;
}

export interface ILog {
    id: number;
    action: string;
    user_id: number;
    target_id?: number | null;
    details?: string;
    created_at: string;
}