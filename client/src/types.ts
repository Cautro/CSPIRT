export type Role = 'user' | 'helper' | 'admin';

export interface User {
    id: string;
    username: string;
    fullName: string;
    className: string;
    role: Role;
    isOwner: boolean;
    socialRating: number;
}

export interface Complaint {
    id: string;
    targetId: string;
    text: string;
    className: string;
}